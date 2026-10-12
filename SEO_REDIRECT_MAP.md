# Legacy URL map

Old site: static HTML on Netlify, canonical form `https://impactomedia.ro/html/<page>.html`, also
served without `.html`. New rules live in `src/lib/legacy-redirects.json` (read by
`next.config.ts` and by `scripts/seo-check.mjs`). Every rule exists for the `.html` and the
extensionless form. Status 308 is Next.js's permanent redirect; Google treats it like 301.

Verification: `next start` on the production build, `curl` per URL, plus the automated
redirect section of `npm run seo:test` (12 October 2026). Not yet verified on the production
host, because the new build is not deployed.

## Redirected

| Old URL | Destination | Status | Reason | Local result |
| --- | --- | --- | --- | --- |
| `/index.html`, `/index` | `/` | 308 | Old homepage file | 308 to `/`, 200 |
| `/html`, `/html/index(.html)` | `/` | 308 | Old folder index / homepage duplicate | 308 to `/`, 200 |
| `/html/services(.html)` | `/servicii` | 308 | Same page, new URL | 308, 200 |
| `/html/about-us(.html)` | `/despre-noi` | 308 | Same page, new URL | 308, 200 |
| `/html/contact(.html)` | `/contact` | 308 | Same page, new URL | 308, 200 |
| `/html/studii-de-caz(.html)` | `/servicii` | 308 | LuxuraInvest case study (video production, drone footage, website). The case-study section was removed at the owner's request; `/servicii` covers the same video and web development work. Previously redirected to `/`, which Google would treat as a soft 404. | 308, 200 |
| `/html/privacy-policy(.html)` | `/politica-de-confidentialitate` | 308 | Same legal text | 308, 200 |
| `/html/cookie-policy(.html)` | `/politica-de-cookie-uri` | 308 | Same legal text | 308, 200 |
| `/html/terms-and-conditions(.html)` | `/termeni-si-conditii` | 308 | Same legal text | 308, 200 |

## Deliberately not redirected (HTTP 404)

| Old URL | Why |
| --- | --- |
| `/html/sign-in(.html)`, `/html/sign-up(.html)` | Template leftovers with no function, already `noindex`. Were redirected to `/` before this audit; now an honest 404. |
| `/404.html`, `/html/404.html` | Error pages that returned 200 on the old host (soft 404). |
| `/llms.txt`, `/site.webmanifest` | Not pages. The new manifest is `/manifest.webmanifest`. |
| `/servicii/website-uri-magazine-online`, `/servicii/strategie-marketing-digital` | Audit candidates only: never existed (404 on the live site, absent from the old files, sitemap, links and search results). |

## Normalisation

| Case | Behaviour | Layer |
| --- | --- | --- |
| Trailing slash (`/servicii/`) | 308 to `/servicii` | Next.js (default `trailingSlash: false`) |
| `/html/` | 308 to `/html`, then 308 to `/` (2 hops) | Next.js. Next applies its trailing-slash redirect before custom rules; the only other affected forms are legacy URLs typed with a trailing slash. Acceptable; Google follows chains of up to 10 hops. |
| `http://` to `https://`, `www` to apex | 301 today on the live Netlify site | Hosting/domain settings. Must stay configured after the switch (see launch checklist). Not duplicated in Next.js to avoid conflicting layers. |
| Query strings (`?utm_source=...`) | Same page, canonical without the query | Canonicals are static per page |

## Manual review

- If a new case study is published later, point `/html/studii-de-caz` at it instead of `/servicii`.
- Old image URLs (`/assets/images/...`) are not redirected. They matter only if external sites
  embed them; the old OG image `/assets/images/logos/logoimpactomedia.png` may be cached by
  social networks for a while and will then show no preview image until they re-crawl.
