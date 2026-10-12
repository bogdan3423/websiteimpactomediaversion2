/**
 * Single source of truth for public pages. The sitemap is generated from this
 * list and the SEO checks (scripts/seo-check.mjs) verify that every indexable
 * page here really is a canonical, indexable 200.
 *
 * Adding a page: create the route, give it metadata with pageMetadata(), then add
 * it here. Future content types (for example blog articles) can append their own
 * entries, with a real lastModified date when one exists.
 */
export type PublicRoute = {
  path: string;
  /** Include in the sitemap and expect index,follow. */
  indexable: boolean;
  /** Only set from a reliable source (never "now"). */
  lastModified?: Date;
};

export const publicRoutes: PublicRoute[] = [
  { path: "/", indexable: true },
  { path: "/servicii", indexable: true },
  { path: "/despre-noi", indexable: true },
  { path: "/contact", indexable: true },
  { path: "/politica-de-confidentialitate", indexable: true },
  { path: "/politica-de-cookie-uri", indexable: true },
  { path: "/termeni-si-conditii", indexable: true },
];
