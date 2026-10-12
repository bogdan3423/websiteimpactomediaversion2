/**
 * Decides whether a build must be kept out of search engines.
 *
 * Indexing is switched off only deliberately, never by accident:
 *  - SEO_NOINDEX=true (explicit switch for any staging host), or
 *  - a recognised preview build: Netlify deploy previews / branch deploys
 *    (CONTEXT other than "production") or Vercel previews (VERCEL_ENV=preview).
 *
 * A production build without these variables is always indexable. Canonicals,
 * the sitemap and structured data always use the production origin, so a
 * misconfigured host can never leak into them.
 *
 * Kept free of path aliases so next.config.ts can import it too.
 */
export function shouldNoIndex(env: Record<string, string | undefined> = process.env): boolean {
  if (env.SEO_NOINDEX === "true") return true;
  if (env.CONTEXT && env.CONTEXT !== "production") return true;
  if (env.VERCEL_ENV === "preview") return true;
  return false;
}
