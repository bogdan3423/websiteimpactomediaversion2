import fs from "node:fs";
import path from "node:path";
import { blogAuthors, blogCategories, blogInfo, type BlogAuthor, type BlogCategory } from "@/content/blog";
import { parseBlogDate } from "@/lib/blog/dates";
import { parseFrontmatter } from "@/lib/blog/frontmatter";
import { imageSize } from "@/lib/blog/image-size";
import { renderMarkdown, type TocItem } from "@/lib/blog/markdown";

/**
 * Loads the articles in content/blog at build time. Every page of the blog is
 * statically generated, so this runs only during `next build` / `next dev`.
 *
 * Mistakes that would hurt SEO or break a page (missing description, unknown
 * category, image without alt text, "#" headings...) stop the build with a
 * clear message in Romanian, so nothing broken can be published.
 */

const POSTS_DIR = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.BLOG_DIR || "content/blog");
const PUBLIC_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public");

/** Drafts and future-dated articles are visible in `next dev` or with BLOG_PREVIEW=true. */
const preview = process.env.NODE_ENV === "development" || process.env.BLOG_PREVIEW === "true";

export type Post = {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  published: Date;
  publishedIso: string;
  updated?: Date;
  updatedIso?: string;
  cover?: { src: string; width: number; height: number; alt: string };
  html: string;
  toc: TocItem[];
  words: number;
  minutes: number;
  draft: boolean;
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function loadPost(file: string, errors: string[], warnings: string[]): Post | null {
  const slug = file.replace(/\.md$/, "");
  const fail = (msg: string) => errors.push(`${file}: ${msg}`);
  const warn = (msg: string) => warnings.push(`${file}: ${msg}`);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail("numele fișierului devine adresa articolului: folosește doar litere mici fără diacritice, cifre și cratime (ex. google-ads-pentru-restaurante.md)");
  }

  let parsed;
  try {
    parsed = parseFrontmatter(fs.readFileSync(path.join(/*turbopackIgnore: true*/ POSTS_DIR, file), "utf8"));
  } catch (error) {
    fail((error as Error).message);
    return null;
  }
  const { data, body } = parsed;

  const title = str(data.title);
  const seoTitle = str(data.seoTitle) || title;
  const description = str(data.description);
  const draft = data.draft === true;

  if (!title) fail("lipsește title");
  else if (title.length > 110) fail(`title are ${title.length} caractere (maxim 110)`);
  if (seoTitle.length > 60) warn(`titlul pentru Google are ${seoTitle.length} caractere; peste ~60 poate fi tăiat în rezultate (adaugă seoTitle mai scurt)`);

  if (!description) fail("lipsește description (textul afișat în Google)");
  else if (description.length < 70) fail(`description are doar ${description.length} caractere (minim 70, ideal 120-160)`);
  else if (description.length > 170) warn(`description are ${description.length} caractere; peste ~160 poate fi tăiată în Google`);

  const published = parseBlogDate(str(data.date));
  if (!published) fail(`date lipsește sau nu are formatul AAAA-LL-ZZ (ex. 2026-11-12 sau 2026-11-12 09:30)`);
  const updatedRaw = str(data.updated);
  const updated = updatedRaw ? parseBlogDate(updatedRaw) : null;
  if (updatedRaw && !updated) fail("updated nu are formatul AAAA-LL-ZZ");
  if (published && updated && updated.date < published.date) fail("updated este înainte de date");

  const category = blogCategories.find((c) => c.slug === str(data.category));
  if (!category) fail(`category "${str(data.category)}" nu există. Variante: ${blogCategories.map((c) => c.slug).join(", ")}`);

  const author = blogAuthors.find((a) => a.slug === (str(data.author) || "rus-bogdan"));
  if (!author) fail(`author "${str(data.author)}" nu există. Variante: ${blogAuthors.map((a) => a.slug).join(", ")}`);

  const tags = Array.isArray(data.tags) ? data.tags.map((t) => t.trim()).filter(Boolean) : str(data.tags) ? [str(data.tags)] : [];

  let cover: Post["cover"];
  const coverSrc = str(data.cover);
  if (coverSrc) {
    const size = coverSrc.startsWith("/") ? imageSize(path.join(/*turbopackIgnore: true*/ PUBLIC_DIR, coverSrc)) : null;
    const coverAlt = str(data.coverAlt);
    if (!size) fail(`imaginea de copertă ${coverSrc} nu există în /public sau nu este JPG, PNG, WebP ori GIF`);
    else if (size.width < 1200) warn(`imaginea de copertă are ${size.width}px lățime; Google recomandă minim 1200px`);
    if (!coverAlt) fail("lipsește coverAlt (descrierea imaginii de copertă)");
    if (size) cover = { src: coverSrc, ...size, alt: coverAlt };
  } else if (!draft) warn("nu are imagine de copertă (cover); recomandat pentru Google Discover și distribuire");

  const contentErrors: string[] = [];
  const { html, toc, words } = renderMarkdown(body, contentErrors);
  contentErrors.forEach(fail);
  if (!draft && words < 300) warn(`articolul are doar ${words} cuvinte; conținutul scurt se clasează greu`);

  if (!title || !description || !published || !category || !author) return null;

  const excerpt = str(data.excerpt) || description;
  return {
    slug,
    path: `/blog/${slug}`,
    title,
    seoTitle,
    description,
    excerpt,
    category,
    tags,
    author,
    published: published.date,
    publishedIso: published.iso,
    updated: updated?.date,
    updatedIso: updated?.iso,
    cover,
    html,
    toc,
    words,
    minutes: Math.max(1, Math.round(words / 200)),
    draft,
  };
}

let cache: Post[] | null = null;

/** Published articles, newest first. */
export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV !== "development") return cache;
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(/*turbopackIgnore: true*/ POSTS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md")
    : [];

  const errors: string[] = [];
  const warnings: string[] = [];
  const posts = files.map((file) => loadPost(file, errors, warnings)).filter((p): p is Post => p !== null);

  const seen = new Map<string, string>();
  for (const post of posts) {
    for (const [kind, value] of [["titlu", post.seoTitle], ["description", post.description]] as const) {
      const key = `${kind}:${value.toLowerCase()}`;
      if (seen.has(key)) errors.push(`${post.slug}.md: același ${kind} ca ${seen.get(key)}.md (Google vrea texte unice)`);
      seen.set(key, post.slug);
    }
  }

  if (warnings.length && !cache) console.warn(`\n[blog] Atenționări:\n  - ${warnings.join("\n  - ")}\n`);
  if (errors.length) throw new Error(`\n[blog] Articole cu probleme (corectează-le înainte de publicare):\n  - ${errors.join("\n  - ")}\n`);

  const now = Date.now();
  cache = posts
    .filter((post) => preview || (!post.draft && post.published.getTime() <= now))
    .sort((a, b) => b.published.getTime() - a.published.getTime());
  return cache;
}

export const getPost = (slug: string) => getAllPosts().find((post) => post.slug === slug);

export const getCategory = (slug: string) => blogCategories.find((category) => category.slug === slug);

export const postsInCategory = (slug: string) => getAllPosts().filter((post) => post.category.slug === slug);

/** Categories that have at least one published article (the only ones that get pages and links). */
export const activeCategories = () =>
  blogCategories
    .map((category) => ({ category, count: postsInCategory(category.slug).length }))
    .filter((entry) => entry.count > 0);

export const pageCount = (total: number) => Math.max(1, Math.ceil(total / blogInfo.postsPerPage));

export const pageSlice = <T,>(items: T[], page: number) =>
  items.slice((page - 1) * blogInfo.postsPerPage, page * blogInfo.postsPerPage);

/** Same category first, then shared tags, then newest. */
export function relatedPosts(post: Post, limit = 3): Post[] {
  const tags = new Set(post.tags.map((t) => t.toLowerCase()));
  return getAllPosts()
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({
      other,
      score:
        (other.category.slug === post.category.slug ? 10 : 0) +
        other.tags.filter((t) => tags.has(t.toLowerCase())).length * 3 +
        other.published.getTime() / 1e13,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.other);
}

export const lastModified = (post: Post) => post.updated ?? post.published;

/** Sitemap entries for the blog, with real modification dates. */
export function blogSitemapEntries(): Array<{ path: string; lastModified?: Date }> {
  const posts = getAllPosts();
  const newest = (list: Post[]) =>
    list.length ? new Date(Math.max(...list.map((p) => lastModified(p).getTime()))) : undefined;
  const entries: Array<{ path: string; lastModified?: Date }> = [];

  const pages = pageCount(posts.length);
  entries.push({ path: "/blog", lastModified: newest(posts) });
  for (let page = 2; page <= pages; page++) entries.push({ path: `/blog/pagina/${page}`, lastModified: newest(pageSlice(posts, page)) });

  for (const { category } of activeCategories()) {
    const list = postsInCategory(category.slug);
    entries.push({ path: `/blog/categorie/${category.slug}`, lastModified: newest(list) });
    for (let page = 2; page <= pageCount(list.length); page++) {
      entries.push({ path: `/blog/categorie/${category.slug}/pagina/${page}`, lastModified: newest(pageSlice(list, page)) });
    }
  }
  for (const post of posts) entries.push({ path: post.path, lastModified: lastModified(post) });
  return entries;
}
