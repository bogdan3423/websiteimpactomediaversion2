import type { NextConfig } from "next";

import legacyRedirects from "./src/lib/legacy-redirects.json";
import { shouldNoIndex } from "./src/lib/indexing";

/**
 * Legacy URLs from the original static website (/html/*.html) are permanently
 * redirected (308) to their equivalent new routes, in a single hop. The old host
 * served both ".html" and extensionless ("pretty") URLs, so both are covered.
 * The list, with the reason for each rule, lives in src/lib/legacy-redirects.json
 * and is documented in SEO_REDIRECT_MAP.md; scripts/seo-check.mjs tests it.
 * URLs with no equivalent (old sign-in/sign-up template pages, /404.html) are
 * deliberately not redirected and return a real 404.
 */
const noIndex = shouldNoIndex();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    return legacyRedirects.flatMap(({ source, destination }) => [
      { source, destination, permanent: true },
      { source: `${source}.html`, destination, permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      // Staging/previews only: keep every response (pages, images, files) out of the index.
      ...(noIndex ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []),
    ];
  },
};

export default nextConfig;
