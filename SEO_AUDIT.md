# ImpactoMedia, technical SEO audit (before implementation)

Audit date: 12 October 2026. Scope: the Next.js rebuild in `websiteimpactonew`, the original static
site in `websiteimpactoinitial` (read-only) and the live site `https://impactomedia.ro` (still the
old static site, hosted on Netlify). Every finding below was observed in code, in the production
build served locally (`next start`), or with `curl` against the live domain.

## 1. Stack and rendering

| Item | Finding |
| --- | --- |
| Framework | Next.js 16.4.0 (App Router, Turbopack), React 19.3, TypeScript strict, Tailwind CSS 4 |
| Rendering | All 7 public pages are statically prerendered (`○ Static`). Full content, headings and links are in the initial HTML. No API routes remain (the contact form posts from the browser to FormSubmit). |
| Client JS | Header (menu, active pill, `motion`), ContactForm (`motion`), RotatingWord, RevealObserver. Everything else is a server component. |
| Fonts | `next/font/google` (Archivo variable with `wdth` axis, Instrument Sans), self-hosted, `display: swap`, latin + latin-ext, size-adjusted fallbacks. Two preloaded woff2 files, about 90 KB and 86 KB. |
| Images | `next/image` everywhere (AVIF/WebP, explicit dimensions, blur placeholders for photos). No videos remain after the case-study removal. |
| Hosting | Live site: Netlify (`server: Netlify`), HTTPS, `www` and `http` already 301 to `https://impactomedia.ro`. The deployment target of the new build is not configured in the repo. |

## 2. Existing SEO infrastructure

| Item | Status before | Notes |
| --- | --- | --- |
| `app/robots.ts` | Present | Allows all, `Disallow: /api/` (route no longer exists), sitemap URL correct. Staging mode returns `Disallow: /`. |
| `app/sitemap.ts` | Present | 7 URLs, hard-coded list, no `lastmod` (correct, no reliable dates). |
| Metadata | Present | Root `metadataBase`, title template, per-page `pageMetadata()` helper with canonical, Open Graph, X card. One `<title>`, one canonical per page. |
| Open Graph image | Present | `/og-image.jpg`, 1200x630, 38 KB, brand logo on paper background. |
| Structured data | Present | Organization, WebSite, WebPage/AboutPage/ContactPage, BreadcrumbList, Service, FAQPage (home). |
| Icons / manifest | Present | `icon.svg`, `apple-icon.png`, `manifest.webmanifest`. |
| Redirects | Present | `next.config.ts` maps old `/html/*` URLs (with and without `.html`). |
| Search Console verification | Prepared | Optional `GOOGLE_SITE_VERIFICATION` env var. No token exists in the repo. |
| Analytics | None | No tracking scripts, no consent banner. |
| `lang` | `ro` on `<html>` | |
| 404 | Correct | Custom page, HTTP 404, `noindex, follow`. |

## 3. Route inventory

Current public routes (all HTTP 200 locally):

| Route | Purpose | Index? |
| --- | --- | --- |
| `/` | Homepage | yes |
| `/servicii` | Services (video, PPC, web, one page with anchors) | yes |
| `/despre-noi` | About, team, company facts | yes |
| `/contact` | Contact details and form | yes |
| `/politica-de-confidentialitate` | Privacy policy | yes |
| `/politica-de-cookie-uri` | Cookie policy | yes |
| `/termeni-si-conditii` | Terms | yes |

Technical routes: `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/icon.svg`, `/apple-icon.png`.
Removed during the redesign at the owner's request: `/studii-de-caz` (and its detail page).

## 4. Legacy URL findings

Sources: the original files, the live sitemap, live HTML links, `_redirects`, and HTTP checks.

| Old URL (live today) | Live status | What it is |
| --- | --- | --- |
| `/` | 200 | Homepage |
| `/html/services.html` (+ `/html/services`) | 200 | Services, in the live sitemap |
| `/html/about-us.html` (+ extensionless) | 200 | About, in sitemap |
| `/html/contact.html` (+ extensionless) | 200 | Contact, in sitemap |
| `/html/studii-de-caz.html` (+ extensionless) | 200 | LuxuraInvest case study, in sitemap, canonical to itself |
| `/html/privacy-policy.html`, `/html/cookie-policy.html`, `/html/terms-and-conditions.html` | 200 | Legal pages, in sitemap |
| `/index.html`, `/html/`, `/html/index.html` | 301 to `/` | Already redirected by Netlify |
| `/html/sign-in.html`, `/html/sign-up.html` | 200 | Template leftovers, `noindex`, no function |
| `/404.html`, `/html/404.html` | 200 | Soft 404 pages (error page served with 200) |
| `/llms.txt`, `/site.webmanifest` | 200 | Non-page files |
| `/servicii/website-uri-magazine-online`, `/servicii/strategie-marketing-digital` | 404 | Never existed: not in the old files, sitemap, links or search results. No redirect needed. |

Old canonical form: `https://impactomedia.ro/html/<page>.html`. Old internal links used absolute `.html` URLs.

## 5. Findings by severity

### Critical
None. Pages render server-side, are indexable, have unique titles and canonicals, and the 404 is a real 404.

### High
1. **Removed case study redirected to the homepage.** `/html/studii-de-caz` 308 to `/`. Google treats irrelevant homepage redirects as soft 404s. Needs a relevant destination or an honest 404.
2. **Staging detection can noindex production.** `isNoIndex` is true whenever `SITE_URL` is set to anything other than exactly `https://impactomedia.ro` (for example `https://www.impactomedia.ro`). A single env typo would noindex the live site and switch canonicals to the wrong host.
3. **Organization logo is too small for Google.** `logo-impactomedia.png` is 756x104; Google requires at least 112x112.
4. **Template pages redirected to the homepage.** `/html/sign-in(.html)` and `/html/sign-up(.html)` 308 to `/` although they had no content and were `noindex`. Should simply 404.

### Medium
5. **Homepage title does not state what and where.** "ImpactoMedia | Marketing video, PPC și dezvoltare web" omits "agenție" and "Cluj-Napoca", which the page itself states in its eyebrow and copy.
6. **Location repeated in three titles.** About and Contact titles both end in "Agenție de marketing (din/în) Cluj-Napoca", competing with the homepage.
7. **Reveal animations wait for the React bundle.** Elements with `data-reveal` stay at opacity 0 until the `RevealObserver` client component hydrates. On `/servicii` the LCP element is such a heading: observed LCP 1.0 s unthrottled versus 0.16 s on the home page.
8. **robots.txt disallows a route that does not exist** (`/api/`). Harmless but misleading.
9. **No single source of truth for indexable routes.** Sitemap, nav and checks each list paths by hand.
10. **No automated SEO regression checks.**
11. **Small orange labels fail WCAG contrast** (`#e2431b` on `#f2f0eb`, 3.64:1 at 12 px). Fixing changes the brand colour, so it is a recommendation, not a silent change.

### Low
12. **FAQPage markup on the homepage.** Valid, but FAQ rich results are limited to authoritative government and health sites, so it adds weight without benefit.
13. **Homepage canonical renders as `https://impactomedia.ro` (no slash) while the sitemap lists `https://impactomedia.ro/`.** Equivalent per the URL standard and for Google; noted for consistency.
14. **Manifest `theme_color` (#111110) differs from the page `theme-color` (#f2f0eb).**
15. **Homepage H1 text appears twice in the HTML** (screen-reader sentence plus the animated words). Accessible and not hidden content, but the visible words include all three rotating endings.
16. **No Bing verification hook.**
17. **Trailing-slash legacy variants create a 2-hop chain** (`/html/services/` to `/html/services` to `/servicii`). Rare in practice.

## 6. Performance baseline (lab, Lighthouse 12, mobile emulation, local `next start`)

| Page | Perf | A11y | Best pr. | SEO | LCP (simulated) | LCP (observed) | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 88 | 100 | 100 | 100 | 4.0 s | 0.16 s | 0 ms | 0 |
| `/servicii` | 88 | 96 | 100 | 100 | 3.9 s | 1.0 s | 0 ms | 0 |

The simulated LCP is dominated by the two preloaded font files and JS chunks under Lighthouse's
slow-4G model (render delay, not resource load). No field (CrUX) data exists for the new site yet.

## 7. Structured data opportunities

- Fix the logo, add a `contactPoint` and the public `taxID` (CUI, shown on the contact page).
- Keep `Service` nodes on `/servicii` (they mirror visible content; no rich result is implied).
- Do **not** add `LocalBusiness`: the address is the registered office in an apartment block, with no
  public office or opening hours. Organization + PostalAddress describes it truthfully.
- No `VideoObject`: there are no public videos on the new site.
- No `SearchAction`: the site has no search.

## 8. Implementation priorities

1. Production-safe indexation logic, canonical host fixed to production.
2. Legacy redirect map: relevant destinations only, honest 404s, single hop.
3. Metadata refinements (home, about, contact titles).
4. Structured data fixes (logo, contactPoint, remove FAQPage).
5. Reveal script that runs before hydration (LCP on inner pages).
6. Central route registry feeding the sitemap.
7. Automated SEO checks against the built site.
8. Documentation and launch checklist.
