import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

/** Indexable pages only. No priority/changefreq (ignored by Google), no invented lastmod. */
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes
    .filter((route) => route.indexable)
    .map((route) => ({
      url: absoluteUrl(route.path),
      ...(route.lastModified ? { lastModified: route.lastModified } : {}),
    }));
}
