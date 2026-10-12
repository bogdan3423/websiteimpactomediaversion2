# SEO launch checklist

For the switch from the old static site to the Next.js build. Nothing here has been done yet;
it all needs the hosting, DNS or Search Console accounts.

## Before deploying

- [ ] `npm run check` and `npm run seo:test` pass on the commit you deploy.
- [ ] Production environment has **no** `SEO_NOINDEX` (or `SEO_NOINDEX=false`).
- [ ] If the host is Netlify: the production deploy runs with `CONTEXT=production` (default).
      Deploy previews and branch deploys are noindexed automatically.
- [ ] Optional: add `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` if you use meta-tag verification.
- [ ] Remove the old static deploy's `_redirects` rules only if the new host does not already
      handle HTTPS and `www` (see below). Do not configure the same redirect in two layers.

## Right after deploying (first hour)

- [ ] `https://impactomedia.ro/` loads the new site.
- [ ] `http://impactomedia.ro/`, `https://www.impactomedia.ro/`, `http://www.impactomedia.ro/`
      each 301/308 in **one hop** to `https://impactomedia.ro/` (`curl -I`). This is a host/domain
      setting (Netlify: set `impactomedia.ro` as primary domain, HTTPS enabled).
- [ ] `https://impactomedia.ro/robots.txt` shows `Allow: /` and the sitemap line.
- [ ] `https://impactomedia.ro/sitemap.xml` lists the 7 pages.
- [ ] View source of 2-3 pages: canonical is `https://impactomedia.ro/...`, robots meta is `index, follow`,
      no `X-Robots-Tag: noindex` header (`curl -I`).
- [ ] Old URLs redirect: `/html/services.html`, `/html/about-us.html`, `/html/contact.html`,
      `/html/studii-de-caz.html`, the three legal pages (see `SEO_REDIRECT_MAP.md`).
- [ ] Run `BASE=https://impactomedia.ro npm run seo:check`.
- [ ] Submit the contact form once and complete the FormSubmit activation e-mail.

## Google Search Console

1. **Property**: add a *Domain* property for `impactomedia.ro` (covers http/https/www).
   If a URL-prefix property for `https://impactomedia.ro/` already exists, keep it.
2. **Verify**: Domain properties need a DNS TXT record at the domain registrar. A URL-prefix
   property can instead use the meta tag: put the token in `GOOGLE_SITE_VERIFICATION` and redeploy.
3. **Sitemap**: Indexing → Sitemaps → submit `https://impactomedia.ro/sitemap.xml`. Remove the old
   sitemap entry if it was submitted separately (it listed the `/html/*.html` URLs).
4. **URL Inspection**: inspect `/`, `/servicii`, `/despre-noi`, `/contact`; "Test live URL", check the
   rendered HTML and that the Google-selected canonical matches; request indexing.
   Also inspect one old URL (`/html/services.html`) to confirm Google sees the redirect.
5. **Indexing → Pages**: over the next 2-6 weeks, old `/html/*.html` URLs should move to
   "Page with redirect", new URLs to "Indexed". Investigate "Not found (404)" entries that
   are not in the retired list of `SEO_REDIRECT_MAP.md`.
6. **Crawl stats / errors**: Settings → Crawl stats; watch for 5xx or DNS errors after the switch.
7. **Core Web Vitals**: appears once enough Chrome users visit (can take weeks for a small site).
   Use PageSpeed Insights on the live URLs meanwhile.
8. **Enhancements**: check Breadcrumbs and any structured-data warnings. Run the
   [Rich Results Test](https://search.google.com/test/rich-results) and the
   [Schema.org validator](https://validator.schema.org/) on `/`, `/servicii`, `/contact`.

## Bing Webmaster Tools

1. Sign in at bing.com/webmasters and **import from Google Search Console** (fastest), or add the site manually.
2. Verify with the meta tag (`BING_SITE_VERIFICATION`), the XML file, or a DNS CNAME.
3. Submit `https://impactomedia.ro/sitemap.xml`.
4. Use URL Inspection and Site Scan for errors.

## First weeks

- [ ] Lighthouse / PageSpeed Insights on production, mobile and desktop.
- [ ] Share `/` and `/servicii` on Facebook/LinkedIn (or their debuggers) to refresh link previews.
- [ ] Watch impressions and clicks in Search Console against the period before the launch;
      a short dip during re-crawling is normal after a URL change.
- [ ] Keep the legacy redirects in place for at least a year (ideally permanently).
