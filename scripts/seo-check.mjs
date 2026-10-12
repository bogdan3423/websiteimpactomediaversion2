#!/usr/bin/env node
/**
 * Technical SEO regression checks against a running build (what crawlers receive).
 *
 *   npm run seo:test           build + start on a free port + check (CI-friendly)
 *   BASE=http://localhost:3000 npm run seo:check    check an already running server
 *
 * Production URLs found in the sitemap/canonicals are mapped onto BASE for fetching,
 * but compared in their production form. No dependencies: Node 20+ fetch only.
 */
import { readFileSync } from "node:fs";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/+$/, "");
const PROD = "https://impactomedia.ro";
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const legacy = JSON.parse(readFileSync(new URL("../src/lib/legacy-redirects.json", import.meta.url), "utf8"));
// Old URLs that have no equivalent and must return a real 404 (not a redirect to the homepage).
const GONE = ["/html/sign-in.html", "/html/sign-up", "/html/404.html", "/404.html", "/servicii/strategie-marketing-digital"];

const errors = [];
const warnings = [];
let passed = 0;
const ok = (cond, msg, warnOnly = false) => {
  if (cond) passed++;
  else (warnOnly ? warnings : errors).push(msg);
  return cond;
};

const toLocal = (url) => url.replace(PROD, BASE);
const norm = (url) => (url === `${PROD}/` ? PROD : url.replace(/\/+$/, "") || PROD);
const cache = new Map();

async function get(path, { follow = false } = {}) {
  const url = path.startsWith("http") ? toLocal(path) : BASE + path;
  const key = `${url}|${follow}`;
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(url, { redirect: follow ? "follow" : "manual", headers: { "User-Agent": UA } });
  const body = res.status < 300 && /text|xml|json/.test(res.headers.get("content-type") || "") ? await res.text() : "";
  const out = { status: res.status, headers: res.headers, body, location: res.headers.get("location") };
  cache.set(key, out);
  return out;
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1];
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function parse(html) {
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const clean = html.replace(/<script[\s\S]*?<\/script>/g, "");
  const head = clean.split("</head>")[0];
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]);
  const meta = (key) => metas.filter((t) => attr(t, "name") === key || attr(t, "property") === key).map((t) => decode(attr(t, "content")));
  return {
    ld,
    lang: clean.match(/<html[^>]*\slang="([^"]*)"/)?.[1],
    titles: [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]).trim()),
    canonicals: [...head.matchAll(/<link\s[^>]*rel="canonical"[^>]*>/g)].map((m) => attr(m[0], "href")),
    meta,
    h1: (clean.match(/<h1[\s>]/g) || []).length,
    imgs: [...clean.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]),
    links: [...clean.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((m) => decode(m[1])),
    ids: new Set([...clean.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
    text: clean,
  };
}

const section = (name) => console.log(`\n# ${name}`);

// robots.txt ---------------------------------------------------------------
section("robots.txt");
const robots = await get("/robots.txt");
ok(robots.status === 200, `robots.txt returned ${robots.status}`);
ok(/^text\/plain/.test(robots.headers.get("content-type") || ""), "robots.txt is not text/plain");
ok(/^User-Agent:\s*\*/im.test(robots.body), "robots.txt has no User-agent: * group");
ok(!/^Disallow:\s*\/\s*$/im.test(robots.body), "robots.txt blocks the whole site (Disallow: /)");
ok(!/^Disallow:\s*\/_next/im.test(robots.body), "robots.txt blocks /_next (rendering assets)");
ok(!/noindex/i.test(robots.body), "robots.txt contains an unsupported noindex rule");
ok(robots.body.includes(`Sitemap: ${PROD}/sitemap.xml`), "robots.txt does not reference the production sitemap");

// sitemap.xml --------------------------------------------------------------
section("sitemap.xml");
const sm = await get("/sitemap.xml");
ok(sm.status === 200, `sitemap.xml returned ${sm.status}`);
ok(/xml/.test(sm.headers.get("content-type") || ""), "sitemap.xml is not served as XML");
ok(sm.body.startsWith("<?xml") && sm.body.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), "sitemap.xml lacks the XML declaration or the sitemap namespace");
ok((sm.body.match(/<urlset/g) || []).length === 1 && sm.body.trim().endsWith("</urlset>"), "sitemap.xml is not a single well-formed urlset");
const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
ok(locs.length > 0, "sitemap.xml lists no URLs");
ok(new Set(locs).size === locs.length, "sitemap.xml contains duplicate URLs");
for (const loc of locs) ok(loc.startsWith(`${PROD}/`), `sitemap URL not on the canonical host: ${loc}`);
for (const lm of [...sm.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])) ok(!Number.isNaN(Date.parse(lm)) && Date.parse(lm) <= Date.now(), `invalid or future lastmod: ${lm}`);
ok(!/<priority>|<changefreq>/.test(sm.body), "sitemap.xml uses priority/changefreq (ignored by Google)", true);
console.log(`  ${locs.length} URLs`);

// Pages --------------------------------------------------------------------
section("Indexable pages (sitemap)");
const titles = new Map();
const descriptions = new Map();
const internalLinks = new Map(); // path -> first page that links it
const fragments = []; // [page, path, id]
const pages = new Map();

for (const loc of locs) {
  const res = await get(loc);
  const where = loc.replace(PROD, "") || "/";
  if (!ok(res.status === 200, `${where}: returned ${res.status}${res.location ? ` -> ${res.location}` : ""} (sitemap URLs must be 200, no redirects)`)) continue;
  ok(!/noindex/i.test(res.headers.get("x-robots-tag") || ""), `${where}: X-Robots-Tag noindex`);
  const p = parse(res.body);
  pages.set(where, p);

  ok(p.lang === "ro", `${where}: <html lang> is "${p.lang}", expected "ro"`);
  ok(p.titles.length === 1, `${where}: ${p.titles.length} <title> tags`);
  const title = p.titles[0] || "";
  ok(title.length >= 15 && !/^(home|acasă|untitled)$/i.test(title), `${where}: weak title "${title}"`);
  ok(title.length <= 75, `${where}: title is ${title.length} characters, may be truncated: "${title}"`, true);
  if (titles.has(title)) errors.push(`${where}: duplicate title with ${titles.get(title)}`);
  titles.set(title, where);

  const desc = p.meta("description");
  ok(desc.length === 1 && desc[0].length >= 50, `${where}: missing or too short meta description`);
  ok(!desc[0] || desc[0].length <= 170, `${where}: description is ${desc[0]?.length} characters, may be truncated`, true);
  if (desc[0] && descriptions.has(desc[0])) errors.push(`${where}: duplicate description with ${descriptions.get(desc[0])}`);
  if (desc[0]) descriptions.set(desc[0], where);

  ok(p.canonicals.length === 1, `${where}: ${p.canonicals.length} canonical tags`);
  ok(norm(p.canonicals[0] || "") === norm(loc), `${where}: canonical ${p.canonicals[0]} does not match sitemap URL ${loc}`);

  const robotsMeta = p.meta("robots").join(",");
  ok(!/noindex|none/i.test(robotsMeta), `${where}: robots meta is "${robotsMeta}" (production pages must be indexable)`);
  ok(!/nofollow/i.test(robotsMeta), `${where}: robots meta has nofollow`);

  for (const key of ["og:title", "og:description", "og:url", "og:image", "og:image:alt", "og:type", "og:site_name", "og:locale", "twitter:card"]) ok(p.meta(key).length >= 1, `${where}: missing ${key}`);
  ok(norm(p.meta("og:url")[0] || "") === norm(loc), `${where}: og:url does not match the canonical`);
  ok(p.meta("og:locale")[0] === "ro_RO", `${where}: og:locale is not ro_RO`);
  const og = p.meta("og:image")[0];
  if (ok(og?.startsWith(`${PROD}/`), `${where}: og:image is not an absolute production URL`)) {
    const img = await get(og);
    ok(img.status === 200 && /^image\//.test(img.headers.get("content-type") || ""), `${where}: og:image ${og} does not resolve to an image`);
  }

  ok(p.h1 >= 1, `${where}: no <h1>`);
  ok(p.h1 <= 1, `${where}: ${p.h1} <h1> elements`, true);

  ok(p.ld.length >= 1, `${where}: no JSON-LD`);
  for (const block of p.ld) {
    let data;
    try { data = JSON.parse(block); } catch (e) { errors.push(`${where}: JSON-LD does not parse (${e.message})`); continue; }
    passed++;
    const nodes = data["@graph"] || [data];
    for (const node of nodes) {
      ok(Boolean(node["@type"]), `${where}: JSON-LD node without @type`);
      if (node["@type"] === "Organization") {
        // Truthfulness: identity data must match what the page visibly offers.
        ok(p.text.includes(`tel:${node.telephone}`), `${where}: Organization telephone ${node.telephone} is not a visible tel: link`);
        ok(p.text.includes(`mailto:${node.email}`), `${where}: Organization email ${node.email} is not a visible mailto: link`);
        ok(node.url === `${PROD}/`, `${where}: Organization url is ${node.url}`);
        const logo = node.logo?.url;
        if (ok(Boolean(logo), `${where}: Organization has no logo`)) {
          const res = await get(logo);
          ok(res.status === 200, `${where}: Organization logo ${logo} returned ${res.status}`);
          ok((node.logo.width ?? 0) >= 112 && (node.logo.height ?? 0) >= 112, `${where}: Organization logo smaller than 112x112`);
        }
      }
      if (node["@type"] === "BreadcrumbList") {
        for (const item of node.itemListElement || []) {
          const r = await get(item.item);
          ok(r.status === 200, `${where}: breadcrumb item ${item.item} returned ${r.status}`);
        }
      }
      if (["WebPage", "AboutPage", "ContactPage", "CollectionPage"].includes(node["@type"])) ok(norm(node.url) === norm(loc), `${where}: ${node["@type"]} url ${node.url} differs from the canonical`);
      ok(node["@type"] !== "FAQPage", `${where}: FAQPage markup (no rich-result eligibility for this site)`, true);
    }
  }

  for (const img of p.imgs) {
    const alt = attr(img, "alt");
    ok(alt !== undefined, `${where}: <img> without alt: ${img.slice(0, 120)}`);
    if (alt === "" && !/aria-hidden="true"/.test(img)) warnings.push(`${where}: <img> with empty alt (fine only if decorative): ${img.slice(0, 100)}`);
  }

  for (const href of p.links) {
    if (/^(mailto:|tel:|https?:\/\/(?!impactomedia\.ro))/.test(href) || href.startsWith("http://localhost")) continue;
    if (href.startsWith("#")) { fragments.push([where, where, href.slice(1)]); continue; }
    const url = new URL(href, `${PROD}${where}`);
    if (url.origin !== PROD) continue;
    if (!internalLinks.has(url.pathname)) internalLinks.set(url.pathname, where);
    if (url.hash) fragments.push([where, url.pathname, url.hash.slice(1)]);
    ok(!/\/html\/|\.html$/.test(url.pathname), `${where}: links to a legacy URL ${href}`);
    ok(!/nofollow/.test(href), `${where}: nofollow internal link`);
  }
}

// Internal links ------------------------------------------------------------
section("Internal links");
for (const [path, from] of internalLinks) {
  const res = await get(path);
  ok(res.status === 200, `broken or redirecting internal link ${path} (from ${from}): ${res.status}${res.location ? ` -> ${res.location}` : ""}`);
  if (res.status === 200 && !locs.includes(`${PROD}${path === "/" ? "/" : path}`)) {
    const p = parse(res.body);
    ok(/noindex/.test(p.meta("robots").join(",")), `linked page ${path} is indexable but missing from the sitemap`, true);
  }
}
for (const [from, path, id] of fragments) {
  const page = pages.get(path) || parse((await get(path)).body);
  ok(page.ids.has(id), `${from}: link to ${path}#${id} but no element has id="${id}"`);
}
console.log(`  ${internalLinks.size} unique internal URLs, ${fragments.length} fragment links`);

// Redirects ---------------------------------------------------------------------
section("Legacy redirects");
for (const { source, destination } of legacy) {
  for (const variant of [source, `${source}.html`]) {
    const res = await get(variant);
    const target = res.location ? new URL(res.location, BASE).pathname : null;
    ok([301, 308].includes(res.status), `${variant}: expected a permanent redirect, got ${res.status}`);
    ok(target === destination, `${variant}: redirects to ${target}, expected ${destination}`);
    if (target) {
      const final = await get(target);
      ok(final.status === 200, `${variant}: destination ${target} returned ${final.status} (chain or broken)`);
    }
  }
}
for (const path of GONE) {
  const res = await get(path);
  ok(res.status === 404, `${path}: expected 404 (no equivalent page), got ${res.status}${res.location ? ` -> ${res.location}` : ""}`);
}
console.log(`  ${legacy.length * 2} redirect rules, ${GONE.length} retired URLs`);

// Status codes & normalisation ------------------------------------------------
section("Status codes");
const missing = await get("/pagina-inexistenta-seo-check");
ok(missing.status === 404, `unknown URL returned ${missing.status} (soft 404)`);
const missingHtml = missing.body || (await (await fetch(`${BASE}/pagina-inexistenta-seo-check`)).text());
ok(/<meta name="robots" content="noindex/.test(missingHtml), "404 page is not noindex");
const slash = await get("/servicii/");
ok([301, 308].includes(slash.status) && new URL(slash.location || "/", BASE).pathname === "/servicii", "trailing slash is not normalised with a permanent redirect");

// Summary ------------------------------------------------------------------------
console.log(`\n${passed} checks passed, ${warnings.length} warnings, ${errors.length} errors (${BASE})`);
for (const w of warnings) console.log(`  WARN  ${w}`);
for (const e of errors) console.log(`  FAIL  ${e}`);
process.exit(errors.length ? 1 : 0);
