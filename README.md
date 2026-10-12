# ImpactoMedia — website v2

Website-ul ImpactoMedia (agenție de marketing din Cluj-Napoca), reconstruit în Next.js.
Conținutul public este în limba română; codul și documentația tehnică sunt în engleză.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 with design tokens in `src/app/globals.css` |
| Motion | `motion` (Motion for React) for the mobile menu and contact form states; CSS + one IntersectionObserver for scroll reveals |
| Fonts | Archivo (variable, width axis) for display, Instrument Sans for text, self-hosted at build time through `next/font` |
| Images | `next/image` with static imports (AVIF/WebP, blur placeholders, no layout shift) |
| Contact delivery | FormSubmit AJAX endpoint, called from the browser (no backend, no key, no dependency) |

Runtime dependencies: `next`, `react`, `react-dom`, `motion`. Nothing else.

## Getting started

Requirements: Node.js 20.9 or newer (tested with Node 25) and npm.

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start                # serves the production build on http://localhost:3000
```

Quality checks:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (next/core-web-vitals + typescript)
npm run check       # typecheck + lint + build
```

## Project structure

```text
src/
  app/                      Routes (App Router). Every page is statically generated.
    page.tsx                Homepage
    servicii/               Services
    despre-noi/             About
    contact/                Contact page
    politica-de-*/,         Legal pages (shared LegalPage template)
    termeni-si-conditii/
    sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.png, not-found.tsx
    globals.css             Design tokens, type scale, layout utilities, reveal styles
  components/
    layout/                 Header (desktop + mobile menu), Footer
    sections/               Page sections: PageHero, SectionIntro, ServiceIndex, StatsBand,
                            ClientWall, TeamGrid, NumberedList, ClosingCta
    ui/                     Primitives: ButtonLink/TextLink, Eyebrow, Accordion, Logo, icons, JsonLd
    motion/RevealScript     Inline scroll-reveal script (runs before hydration)
    contact/ContactForm     Client-side form with shared validation
    legal/LegalPage         Legal page template
  content/                  All copy and structured data (services, team, clients, FAQ,
                            legal texts). Edit text here, not in components.
  lib/                      Metadata helpers, JSON-LD builders, contact validation, site URL
  assets/                   Optimised images imported by components (logos, team, services)
public/
  media/clients/            SVG client logo (Wine District)
  og-image.jpg              Default social sharing image
scripts/
  prepare-assets.py         Regenerates src/assets + public/media from ../websiteimpactoinitial
  extract-legal.py          Regenerates src/content/legal/*.ts from the original legal pages
```

### Editing content

- Text, services, FAQ, team and figures: `src/content/*.ts`.
- Legal texts: `src/content/legal/*.ts` (HTML strings). They were migrated verbatim.

## Routes and redirects

Old `/html/*` URLs are permanently redirected (308, one hop) to their new routes. The rules
and their reasons live in `src/lib/legacy-redirects.json`; the full map, including URLs that
deliberately return 404, is in [`SEO_REDIRECT_MAP.md`](SEO_REDIRECT_MAP.md).

Security headers (ported from the old `_headers`) live in `next.config.ts`. Host-level rules
(HTTP to HTTPS, `www` to apex) belong to the hosting platform; see
[`SEO_LAUNCH_CHECKLIST.md`](SEO_LAUNCH_CHECKLIST.md).

## SEO

- Audit: [`SEO_AUDIT.md`](SEO_AUDIT.md) · Implementation: [`SEO_IMPLEMENTATION.md`](SEO_IMPLEMENTATION.md)
- Public pages are registered in `src/lib/routes.ts` (feeds the sitemap).
- `npm run seo:test` builds the site, serves it and runs `scripts/seo-check.mjs`.

## Environment variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `SEO_NOINDEX` | `true` adds `noindex` (meta + `X-Robots-Tag`) to every response. Previews on Netlify/Vercel are detected automatically. Production never needs it. |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console meta-tag token. |
| `BING_SITE_VERIFICATION` | Optional Bing Webmaster Tools meta-tag token. |

## Contact form

The form validates input in the browser (`src/lib/contact.ts`), drops submissions that
fill the hidden honeypot field, and sends an AJAX request to FormSubmit
(`site.formEndpoint` in `src/content/site.ts`), which e-mails every enquiry to
`contact@impactomedia.ro` with the visitor's address as reply-to.

One-time activation: the first submission makes FormSubmit send an "Activate Form" e-mail
to contact@impactomedia.ro. Click the link once; from then on messages are delivered.
Optionally replace the address in `formEndpoint` with the random alias FormSubmit offers
after activation, so the inbox address is not visible in the page source.

The success state only appears after FormSubmit accepted the message; otherwise the form
points visitors to e-mail and phone.

## Hosting

Every page is static and the contact form needs no backend. Any platform that runs
Next.js 16 works (Vercel, Netlify, a Node server with `npm run start`, Docker).

## Things that need a human decision

1. **Legal review.** The privacy and cookie policies were copied verbatim. They still state
   that the site loads Google Fonts, jsDelivr and Iconify from third parties; the new site
   self-hosts its fonts and loads no third-party scripts. FormSubmit, which delivers the
   contact form, is a data processor and should be mentioned. The texts should be reviewed and
   updated by the company before launch. No legal wording was changed in this rebuild.
2. **Hero video on the old homepage** (`banner-video*.mp4`, a woman holding a helmet) was not
   reused: its origin could not be verified and it does not show ImpactoMedia work.
3. **Generic template images** from the old theme (`about-img.jpg`, `projects-banner`, portfolio and
   services placeholders, stock testimonials) were intentionally not migrated.
4. **English version.** The old site had a client-side machine-style EN toggle. The brief
   requires a Romanian-only site, so it was not rebuilt.
# websiteimpactomediav2
# websiteimpactomediaversion2
