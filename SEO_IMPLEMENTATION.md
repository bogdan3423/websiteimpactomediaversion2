# Technical SEO implementation

What was changed after the audit in `SEO_AUDIT.md`, where it lives, and how to keep it working.
No visual design, copy (other than titles), typography, colours or layout were changed.

## 1. Architecture

| Concern | File |
| --- | --- |
| Canonical origin + indexing switch | `src/lib/site-url.ts`, `src/lib/indexing.ts` |
| Public page registry | `src/lib/routes.ts` |
| Per-page metadata helper | `src/lib/metadata.ts` (`pageMetadata()`) |
| Root metadata, verification tokens | `src/app/layout.tsx` |
| robots.txt / sitemap.xml | `src/app/robots.ts`, `src/app/sitemap.ts` |
| Structured data builders | `src/lib/structured-data.ts`, rendered by `src/components/ui/JsonLd.tsx` |
| Legacy redirects | `src/lib/legacy-redirects.json` → `next.config.ts` |
| Headers (security, staging `X-Robots-Tag`) | `next.config.ts` |
| Scroll reveal | `src/components/motion/RevealScript.tsx` |
| Regression checks | `scripts/seo-check.mjs`, `scripts/seo-ci.mjs` |

## 2. Indexation strategy

- **Production** (no special env vars): every page `index, follow, max-image-preview:large`.
- **Staging / previews**: `noindex, nofollow` meta on every page **and** `X-Robots-Tag: noindex, nofollow`
  on every response (images and files included). Triggered only by `SEO_NOINDEX=true`, Netlify
  `CONTEXT` other than `production`, or `VERCEL_ENV=preview`.
- The old rule "any `SITE_URL` other than production means noindex" was removed: a typo such as
  `https://www.impactomedia.ro` would have de-indexed the live site. `SITE_URL` no longer exists;
  canonicals always use `https://impactomedia.ro`.
- robots.txt is never used to hide staging (a `Disallow` would stop crawlers from seeing the noindex).
  Staging access control (password protection) is a hosting setting.
- 404 page: HTTP 404 + `noindex, follow`.
- Legal pages stay indexable: they are useful trust pages for a company site, unique, and short.
  This is a deliberate choice, not a default.

## 3. robots.txt

```
User-Agent: *
Allow: /

Sitemap: https://impactomedia.ro/sitemap.xml
```

The obsolete `Disallow: /api/` was removed (the route no longer exists). `/_next/` assets, images
and fonts are not blocked. Served as `text/plain`, HTTP 200.

## 4. Sitemap

Generated from `publicRoutes` (indexable entries only): 7 URLs, absolute, HTTPS, apex host,
matching each page's canonical. No `lastmod` (no reliable modification date exists; a fake "now"
would be worse than none), no `priority`/`changefreq`. When a real date exists (for example a
future blog article's `dateModified`), set `lastModified` on that entry.

## 5. Canonicals and metadata

`pageMetadata({ title, description, path })` produces: absolute title (no template stacking),
description, canonical, Open Graph (`website`, `ro_RO`, site name, URL, 1200x630 image with alt)
and a `summary_large_image` X card. Metadata is static (`export const metadata`), present in the
initial HTML, one `<title>` and one canonical per page. The homepage canonical is rendered by
Next.js as `https://impactomedia.ro` (no slash); this is the same URL as `https://impactomedia.ro/`
in the sitemap per the URL standard.

| Page | URL | Title | Meta description | Canonical | Index |
| --- | --- | --- | --- | --- | --- |
| Acasă | `/` | Agenție de marketing în Cluj-Napoca: video, PPC și web \| ImpactoMedia | Agenție de marketing din Cluj-Napoca pentru producție video, campanii Google, Meta și TikTok Ads, website-uri de prezentare și magazine online. | `https://impactomedia.ro` | index, follow |
| Servicii | `/servicii` | Servicii de marketing video, PPC și web \| ImpactoMedia | Descoperă serviciile ImpactoMedia: producție și editare video, Google Ads, Meta Ads, TikTok Ads, website-uri de prezentare și magazine online. | `https://impactomedia.ro/servicii` | index, follow |
| Despre noi | `/despre-noi` | Despre noi: echipa și modul de lucru \| ImpactoMedia | Cunoaște echipa ImpactoMedia și modul în care conectăm producția video, publicitatea PPC și dezvoltarea web în proiecte coerente. | `https://impactomedia.ro/despre-noi` | index, follow |
| Contact | `/contact` | Contact: telefon, e-mail și formular \| ImpactoMedia | Contactează ImpactoMedia pentru producție video, campanii PPC, website-uri de prezentare sau magazine online. Suntem în Cluj-Napoca. | `https://impactomedia.ro/contact` | index, follow |
| Confidențialitate | `/politica-de-confidentialitate` | Politica de confidențialitate \| ImpactoMedia | Află cum ImpactoMedia și APONTI DIGITAL S.R.L. colectează, utilizează, protejează și păstrează datele personale transmise prin website. | `https://impactomedia.ro/politica-de-confidentialitate` | index, follow |
| Cookie-uri | `/politica-de-cookie-uri` | Politica de cookie-uri \| ImpactoMedia | Informații despre cookie-urile, stocarea locală și resursele tehnice externe utilizate de website-ul ImpactoMedia. | `https://impactomedia.ro/politica-de-cookie-uri` | index, follow |
| Termeni | `/termeni-si-conditii` | Termeni și condiții \| ImpactoMedia | Termenii de utilizare ai website-ului ImpactoMedia și cadrul general pentru solicitări, oferte și colaborări cu APONTI DIGITAL S.R.L. | `https://impactomedia.ro/termeni-si-conditii` | index, follow |
| 404 | any unknown URL | Pagina nu a fost găsită \| ImpactoMedia | (generic) | none | noindex, follow, HTTP 404 |

Title changes: home (now states "agenție" and "Cluj-Napoca", which the page itself says), about and
contact (no longer repeat the location keyword that the homepage targets). Descriptions were already
unique and accurate and were kept. No `meta keywords`.

## 6. Structured data (JSON-LD)

| Type | Where | Notes |
| --- | --- | --- |
| `Organization` (`#organization`) | `/`, `/despre-noi`, `/contact` | Name, legal name, URL, square logo 600x600 (new file `public/brand/logo-impactomedia-square.png`, the old 756x104 logo was below Google's 112 px minimum), description, email, phone, registered address, `taxID` (CUI shown on the contact page), `contactPoint`. All values come from the site's own visible content and legal pages. No social profiles (none exist), no founding date, ratings or reviews. |
| `WebSite` (`#website`) | `/` | No `SearchAction` (there is no site search). |
| `WebPage` / `AboutPage` / `ContactPage` | every page | `isPartOf` the WebSite, `about` the Organization. |
| `BreadcrumbList` | inner pages | Acasă → page, mirrors the visible breadcrumb. |
| `Service` x3 | `/servicii` | Video, PPC, web; text mirrors the visible summaries; provider = Organization. No rich result is implied. |

Removed: `FAQPage` on the homepage (the visible FAQ stays). FAQ rich results are limited to
government and health sites, so the markup only added weight.

Not added, on purpose: `LocalBusiness` (the address is a registered office in an apartment block,
with no public office or opening hours), `VideoObject` (no public videos), `SearchAction`.

Validation done: every JSON-LD block parses, all `@id`/URLs are canonical, breadcrumb targets
return 200, Organization phone/email match visible `tel:`/`mailto:` links (automated). Google's
Rich Results Test and the Schema.org validator need the public URL and were not run yet (launch
checklist). Valid markup never guarantees a rich result.

## 7. Performance and rendering

- **Scroll reveals trigger as soon as an element starts entering the viewport.** The observer
  fires at about 1% visibility (about 4% of the screen above the bottom edge) instead of 12%
  visibility with a 8% bottom margin, so large blocks and images are still animating in while
  they scroll onto the screen rather than appearing only after they are fully visible.
- **Scroll reveals no longer wait for React.** The `RevealObserver` client component was replaced
  by a ~700-byte inline script that runs as soon as the body is parsed (plus a MutationObserver for
  client-side navigations). The CSS now keys off a `data-revealed` attribute, and each
  `data-reveal` element has `suppressHydrationWarning` so React accepts the attribute added before
  hydration. Animations are identical; reduced motion still reveals everything instantly.
  Measured with Chrome (slow 4G, 4x CPU, 390 px): first reveal at about 0.7 s instead of after the JS
  bundle finishes (about 3.1 s); LCP on `/servicii` and `/despre-noi` about 1.0 s.
- `data-scroll-behavior="smooth"` on `<html>` (Next.js 16 recommendation, keeps route changes from
  smooth-scrolling).
- Already good and unchanged: static prerendering, self-hosted fonts with `display: swap` and
  metric-adjusted fallbacks, `next/image` with AVIF/WebP and explicit sizes, CLS 0, TBT 0.
- Manifest `theme_color` aligned with the page `theme-color`.

Lighthouse 12 (lab, local `next start`; no field data yet):

| Page | Before (mobile) | After (mobile) | After (desktop) |
| --- | --- | --- | --- |
| `/` | Perf 88 · LCP 4.0 s sim. · CLS 0 · TBT 0 | Perf 90 · LCP 3.7 s sim. · CLS 0 · TBT 0 | Perf 100 · LCP 0.7 s |
| `/servicii` | Perf 88 · LCP 3.9 s sim. · A11y 96 | Perf 88 · LCP 3.9 s sim. · A11y 96 | Perf 99 · LCP 0.8 s |
| `/despre-noi` | not measured | Perf 88 · LCP 3.9 s sim. | Perf 99 · LCP 0.8 s |

Lighthouse's *simulated* mobile LCP is dominated by downloading two variable fonts (~90 KB each)
and JS chunks under its slow-4G model, and does not reflect the reveal change; the throttled
browser measurement above does. Real-user Core Web Vitals will only exist once the site is live
(Search Console → Core Web Vitals, PageSpeed Insights field data).

## 8. Accessibility / mobile

Unchanged design, verified: `lang="ro"`, one H1 per page, landmarks (header, nav with labels, main,
footer), skip link, labelled mobile menu, all images with Romanian alt text, no horizontal overflow
at 390 px and 1440 px, content visible without JS (the hidden reveal state only applies when the
`js` class is set).

Open (needs a design decision): small orange labels (`#e2431b` on `#f2f0eb`, 12 px) reach 3.64:1,
below WCAG AA 4.5:1. A slightly darker orange for small text only (around `#c2381a`) would pass.

## 9. Analytics and conversions

No analytics is installed and none was added (no IDs were provided, and there is no consent
banner). Recommended when wanted: Google Analytics 4 via `@next/third-parties` or a single
`next/script` tag, loaded only after consent through a consent banner (Consent Mode v2), with
events for `generate_lead` (form success callback in `ContactForm.tsx`), `click_to_call`
(`tel:` links) and `click_email` (`mailto:` links). The privacy and cookie policies must be
updated at the same time.

## 10. Testing

```bash
npm run check      # typecheck + lint + production build
npm run seo:test   # build, serve on a free port, run all SEO checks (exit 1 on failure)
BASE=https://impactomedia.ro npm run seo:check   # after launch, against production
```

`scripts/seo-check.mjs` fetches what a crawler receives (Googlebot user agent, no JS) and checks:
robots.txt (status, type, no sitewide block, no `/_next` block, sitemap line); sitemap (XML,
namespace, unique, canonical host, valid lastmod); for every sitemap URL: 200 without redirect, no
noindex (meta or header), `lang="ro"`, single non-generic and unique title, unique description,
single canonical equal to the sitemap URL, Open Graph/X tags, OG image resolves, H1 present,
JSON-LD parses, Organization data matches visible contact links, breadcrumb targets resolve, all
images have alt; every internal link and `#fragment` target; every legacy redirect (both forms,
single hop, 200 destination); retired URLs return 404; unknown URLs return 404 with noindex;
trailing-slash normalisation.

Last run (12 October 2026): **759 checks passed, 0 warnings, 0 errors.** Running the same checks
against a `SEO_NOINDEX=true` build fails as intended (noindex detected on every page).

## 11. Future blog (not implemented)

A blog can reuse: `pageMetadata()` (add `type: "article"` and dates), `absoluteUrl()`, a
`BlogPosting` builder next to the others in `structured-data.ts`, entries appended to
`publicRoutes` (with real `lastModified`), and the existing checks, which pick up any new sitemap URL
automatically.
