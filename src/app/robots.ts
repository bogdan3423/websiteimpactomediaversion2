import type { MetadataRoute } from "next";
import { absoluteUrl, isNoIndex } from "@/lib/site-url";

/**
 * Production: everything crawlable (including /_next assets needed for rendering)
 * plus the sitemap. Staging/previews stay crawlable on purpose: crawlers must be
 * able to fetch pages to see their noindex (meta tag + X-Robots-Tag header); a
 * Disallow would hide that signal. Staging gets no sitemap reference.
 */
export default function robots(): MetadataRoute.Robots {
  if (isNoIndex) return { rules: { userAgent: "*", allow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
