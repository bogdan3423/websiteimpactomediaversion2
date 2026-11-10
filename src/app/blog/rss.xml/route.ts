import { blogInfo } from "@/content/blog";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of the latest articles (newsletters, readers, faster discovery). */
export function GET() {
  const posts = getAllPosts().slice(0, 30);
  const items = posts
    .map(
      (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${absoluteUrl(post.path)}</link>
      <guid isPermaLink="true">${absoluteUrl(post.path)}</guid>
      <description>${esc(post.description)}</description>
      <category>${esc(post.category.name)}</category>
      <dc:creator>${esc(post.author.name)}</dc:creator>
      <pubDate>${post.published.toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog ${esc(site.name)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${esc(blogInfo.description)}</description>
    <language>ro-RO</language>
    <atom:link href="${absoluteUrl("/blog/rss.xml")}" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${(posts[0].updated ?? posts[0].published).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
