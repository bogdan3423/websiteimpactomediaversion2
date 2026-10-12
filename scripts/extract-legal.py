"""
Migrates the legal pages of the original website into typed content modules.
The legal wording is copied verbatim; only markup is simplified and internal
links are rewritten to the new routes. Run: python3 scripts/extract-legal.py
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "websiteimpactoinitial" / "html"
OUT = ROOT / "src" / "content" / "legal"

LINKS = {
    "privacy-policy.html": "/politica-de-confidentialitate",
    "cookie-policy.html": "/politica-de-cookie-uri",
    "terms-and-conditions.html": "/termeni-si-conditii",
    "contact.html": "/contact",
    "services.html": "/servicii",
    "about-us.html": "/despre-noi",
    "../": "/",
    "../index.html": "/",
}
ALLOWED = {"section", "h2", "h3", "h4", "p", "ul", "ol", "li", "a", "strong", "em", "b", "i", "dl", "dt", "dd",
           "div", "table", "thead", "tbody", "tr", "th", "td", "br", "code", "span"}
VOID = {"br"}


class Sanitizer(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED:
            self.stack.append(None)
            return
        attrs = dict(attrs)
        keep = []
        if tag == "section" and attrs.get("id"):
            keep.append(f'id="{attrs["id"]}"')
        if tag == "div" and "legal-table-wrap" in (attrs.get("class") or ""):
            keep.append('class="legal-table-wrap"')
        if tag == "a":
            href = attrs.get("href", "")
            for old, new in LINKS.items():
                if href == old or href.startswith(old + "#"):
                    href = new + href[len(old):]
                    break
            keep.append(f'href="{href}"')
            if href.startswith("http"):
                keep.append('target="_blank" rel="noopener noreferrer"')
        if tag == "span":
            self.stack.append(None)
            return
        self.out.append(f"<{tag}{(' ' + ' '.join(keep)) if keep else ''}>")
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            return
        top = self.stack.pop()
        if top:
            self.out.append(f"</{top}>")

    def handle_data(self, data):
        self.out.append(re.sub(r"\s+", " ", data))

    def handle_entityref(self, name):
        self.out.append(f"&{name};")

    def handle_charref(self, name):
        self.out.append(f"&#{name};")


def sanitize(fragment: str) -> str:
    parser = Sanitizer()
    parser.feed(fragment)
    html = "".join(parser.out)
    html = re.sub(r">\s+<", "><", html)
    html = re.sub(r"\s+</", "</", html)
    return html.strip()


def block(html: str, start_pattern: str, tag: str) -> str:
    match = re.search(start_pattern, html)
    if not match:
        raise SystemExit(f"pattern not found: {start_pattern}")
    start = match.start()
    depth, pos = 0, start
    opener, closer = re.compile(rf"<{tag}[\s>]"), f"</{tag}>"
    while True:
        next_open = opener.search(html, pos + 1 if depth else pos)
        next_close = html.find(closer, pos + 1)
        if next_open and next_open.start() < next_close:
            depth += 1
            pos = next_open.start()
        else:
            depth -= 1
            pos = next_close
            if depth == 0:
                return html[start: next_close + len(closer)]


def text(fragment: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", fragment)).strip()


pages = {
    "privacy": "privacy-policy.html",
    "cookies": "cookie-policy.html",
    "terms": "terms-and-conditions.html",
}

OUT.mkdir(parents=True, exist_ok=True)
for key, file in pages.items():
    html = (SRC / file).read_text(encoding="utf-8")
    title = text(re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html).group(1))
    intro = text(re.search(r'<p class="mb-0 text-white fs-5 text-opacity-70">([\s\S]*?)</p>', html).group(1))
    summary = block(html, r'<div class="legal-summary">', "div")
    updated = text(re.search(r'<p class="legal-kicker">([\s\S]*?)</p>', summary).group(1))
    summary_title = text(re.search(r"<h2>([\s\S]*?)</h2>", summary).group(1))
    summary_body = sanitize("".join(re.findall(r"<p>[\s\S]*?</p>", summary)))
    toc_html = block(html, r'<aside class="legal-toc"', "aside")
    toc = [{"id": m.group(1), "label": text(m.group(2))} for m in re.finditer(r'<a href="#([^"]+)">([\s\S]*?)</a>', toc_html)]
    article = block(html, r'<article class="legal-content">', "article")
    body = sanitize(article[article.find(">") + 1: article.rfind("</article>")])
    data = {
        "title": title,
        "intro": intro,
        "updated": updated,
        "summaryTitle": summary_title,
        "summaryHtml": summary_body,
        "toc": toc,
        "bodyHtml": body,
    }
    module = (
        "// Generated by scripts/extract-legal.py from the original website. Legal wording is verbatim.\n"
        "import type { LegalDocument } from \"./types\";\n\n"
        f"export const {key}: LegalDocument = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    )
    (OUT / f"{key}.ts").write_text(module, encoding="utf-8")
    print(key, title, updated, len(toc), "sections", len(body), "chars")

(OUT / "types.ts").write_text(
    "export type LegalDocument = {\n  title: string;\n  intro: string;\n  updated: string;\n  summaryTitle: string;\n"
    "  summaryHtml: string;\n  toc: Array<{ id: string; label: string }>;\n  bodyHtml: string;\n};\n",
    encoding="utf-8",
)
