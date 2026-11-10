import path from "node:path";
import { Marked, type Tokens } from "marked";
import { site } from "@/content/site";
import { imageSize } from "@/lib/blog/image-size";
import { slugify } from "@/lib/slug";

export type TocItem = { id: string; text: string };

const PUBLIC_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public");
/** Widths requested from the Next.js image optimiser (must be in its default deviceSizes). */
const WIDTHS = [640, 828, 1080, 1200, 1920];

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const stripTags = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const optimised = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

/**
 * Markdown -> HTML for one article, with the SEO details handled here so authors
 * only write plain Markdown:
 * - one H1 per page (the title): "#" in the body is reported as an error;
 *   "##" sections get stable anchors and form the table of contents;
 * - local images get width/height, responsive AVIF/WebP via the image optimiser,
 *   lazy loading and an optional caption (the Markdown image title);
 * - images without alt text are reported as errors;
 * - external links open in a new tab with rel="noopener noreferrer".
 */
export function renderMarkdown(markdown: string, errors: string[]) {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const anchor = (text: string) => {
    const base = slugify(text) || "sectiune";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };

  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const text = stripTags(inner);
        if (depth === 1) errors.push(`titlul "${text}" folosește "#" (H1). În text folosește "##" pentru secțiuni; H1 este titlul articolului.`);
        const level = Math.max(depth, 2);
        const id = anchor(text);
        if (level === 2) toc.push({ id, text });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },
      paragraph({ tokens }: Tokens.Paragraph) {
        const content = tokens.filter((token) => !(token.type === "text" && !token.raw.trim()));
        const inner = this.parser.parseInline(tokens);
        // An image on its own line becomes a <figure>, which may not sit inside a <p>.
        if (content.length === 1 && content[0]?.type === "image") return `${inner}\n`;
        return `<p>${inner}</p>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//i.test(href) && !href.startsWith(site.productionUrl);
        const local = href.startsWith(site.productionUrl) ? href.slice(site.productionUrl.length) || "/" : href;
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
        return external
          ? `<a href="${escapeAttr(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${inner}</a>`
          : `<a href="${escapeAttr(local)}"${titleAttr}>${inner}</a>`;
      },
      image({ href, title, text }: Tokens.Image) {
        const alt = text.trim();
        if (!alt) errors.push(`imaginea ${href} nu are text alternativ: scrie ![descriere](${href})`);
        const caption = title ? `<figcaption>${escapeAttr(title)}</figcaption>` : "";
        if (!href.startsWith("/")) {
          return `<figure class="blog-figure"><img src="${escapeAttr(href)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async">${caption}</figure>`;
        }
        const size = imageSize(path.join(/*turbopackIgnore: true*/ PUBLIC_DIR, decodeURI(href)));
        if (!size) {
          errors.push(`imaginea ${href} nu există în /public sau nu este JPG, PNG, WebP ori GIF`);
          return "";
        }
        const widths = WIDTHS.filter((w) => w <= size.width);
        if (!widths.length) widths.push(WIDTHS[0] as number);
        const srcset = widths.map((w) => `${optimised(href, w)} ${w}w`).join(", ");
        const src = optimised(href, widths[widths.length - 1] as number);
        return `<figure class="blog-figure"><img src="${escapeAttr(src)}" srcset="${escapeAttr(srcset)}" sizes="(min-width: 1024px) 760px, 92vw" width="${size.width}" height="${size.height}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async">${caption}</figure>`;
      },
    },
  });

  const html = (marked.parse(markdown, { async: false }) as string)
    .replace(/<table>/g, '<div class="blog-table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");

  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return { html, toc, words };
}
