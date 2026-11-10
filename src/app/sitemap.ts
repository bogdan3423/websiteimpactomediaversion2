import type { MetadataRoute } from "next";
import { blogSitemapEntries } from "@/lib/blog/posts";
import { publicRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Indexable pages plus every published blog page. No priority/changefreq
 * (ignored by Google); lastmod only where it is real (article dates).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const blog = blogSitemapEntries();
  const blogPaths = new Set(blog.map((entry) => entry.path));
  return [
    ...publicRoutes.filter((route) => route.indexable && !blogPaths.has(route.path)),
    ...blog,
  ].map((route) => ({
    url: absoluteUrl(route.path),
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
  }));
}
