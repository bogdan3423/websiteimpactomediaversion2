import { site } from "@/content/site";
import { shouldNoIndex } from "@/lib/indexing";

/**
 * Canonical origin for canonical tags, Open Graph URLs, the sitemap and JSON-LD.
 * Always the production domain (https, no www, no trailing slash): previews and
 * staging hosts are noindexed instead of advertising their own URLs.
 */
export const siteUrl = site.productionUrl;

/** True for deliberate staging/preview builds only. See src/lib/indexing.ts. */
export const isNoIndex = shouldNoIndex();

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}
