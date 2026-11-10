# Blogul ImpactoMedia: cum publici un articol

Fiecare articol este un fișier `.md` (Markdown) în acest folder. Numele fișierului devine adresa:
`google-ads-pentru-restaurante.md` → `impactomedia.ro/blog/google-ads-pentru-restaurante`.

## Pașii, pe scurt

1. Creezi articolul: `npm run blog:new -- "Titlul articolului" --categorie publicitate-ppc`
   (sau copiezi `_sablon.md` și îl redenumești).
2. Pui imaginile în `public/blog/<numele-articolului>/` (JPG, PNG sau WebP; coperta minim 1200 px lățime).
3. Scrii textul. Verifici local cu `npm run dev` → http://localhost:3000/blog (ciornele apar doar local).
4. Când e gata: schimbi `draft: true` în `draft: false`, apoi publici (commit + push / redeploy).

Build-ul se oprește cu un mesaj clar dacă lipsește ceva important (descriere, categorie, text alternativ
la imagini etc.), deci nu poți publica din greșeală un articol stricat.

**Articole programate:** un articol cu `date` în viitor nu apare până la primul build de după acea dată.
Dacă vrei programare automată, setează un build zilnic pe hosting (de ex. un „build hook” apelat zilnic).

## Datele de la început (front matter)

```yaml
---
title: "Google Ads pentru restaurante: ghid practic pentru Cluj"   # H1-ul articolului (max. 110 caractere)
seoTitle: "Google Ads pentru restaurante: ghid practic"           # opțional, titlul din Google (max. ~60)
description: "Rezumatul din Google, 120-160 de caractere."         # obligatoriu, unic pe site
date: 2026-11-12            # sau 2026-11-12 09:30 (ora României)
updated: 2026-12-01         # opțional, doar când actualizezi conținutul real
category: publicitate-ppc   # publicitate-ppc | marketing-video | website-uri | social-media | strategie
tags: [Google Ads, Restaurante, Cluj-Napoca]
author: rus-bogdan          # rus-bogdan | irina-blaga | vlad-potra
cover: /blog/google-ads-pentru-restaurante/cover.jpg
coverAlt: "Descrierea concretă a imaginii"
excerpt: "Opțional: textul de pe card, dacă vrei altul decât description."
draft: false
---
```

## Scrierea în Markdown

```markdown
Paragraf normal. **Îngroșat**, *italic*, [link intern](/servicii#publicitate-ppc), [link extern](https://ads.google.com).

## Secțiune (apare în cuprins)
### Subsecțiune

- listă
- cu puncte

1. listă
2. numerotată

> Citat sau idee scoasă în evidență.

![Descrierea imaginii (obligatoriu)](/blog/numele-articolului/imagine.jpg "Legendă opțională sub imagine")

| Coloană | Coloană |
| --- | --- |
| valoare | valoare |
```

Nu folosi `#` (un singur diez): titlul articolului este deja H1.

## Lista SEO pentru fiecare articol

- **O singură intenție de căutare** per articol. Alege expresia principală (ex. „cât costă Google Ads”)
  și nu scrie două articole pe aceeași expresie (se canibalizează).
- Expresia principală în: `title`, `description`, primul paragraf, cel puțin un `##`, numele fișierului.
- **Primul paragraf răspunde direct** la întrebare. Detaliile vin după.
- `description` de 120-160 de caractere, unică, scrisă ca un motiv de a da click.
- Structură clară cu `##` și `###` (cuprinsul se generează automat din `##`).
- **2-4 linkuri interne**: către serviciul potrivit (`/servicii#publicitate-ppc`, `/servicii#marketing-video`,
  `/servicii#dezvoltare-web`) și către alte articole din blog. Text de link descriptiv, nu „click aici”.
- 1-2 linkuri externe doar către surse de încredere (documentația Google, Meta etc.).
- Copertă proprie (minim 1200 px), imagini cu text alternativ concret. Fără imagini de stoc generice dacă se poate.
- Experiență reală: exemple din proiectele voastre, capturi, cifre verificate. Google favorizează conținutul
  scris din experiență (E-E-A-T); de aceea fiecare articol are autor cu nume și rol.
- O secțiune „Întrebări frecvente” la final ajută la căutările formulate ca întrebări.
- Lungime: cât e nevoie pentru a răspunde complet (de obicei 800-2.000 de cuvinte), nu umplutură.
- Actualizează articolele vechi care aduc trafic și pune `updated:` doar când schimbi conținutul real.

## Ce se face automat

Titlu și descriere, canonical, Open Graph și card X, date de publicare și actualizare, date structurate
`BlogPosting` + `BreadcrumbList` + autor, cuprins cu ancore, timp de citire, articole similare, link
contextual către serviciu, paginare, pagini de categorie, sitemap cu `lastmod` real, flux RSS
(`/blog/rss.xml`), imagini optimizate (AVIF/WebP, dimensiuni fixe, încărcare leneșă) și cele mai noi
3 articole pe pagina principală.

Fișierele care încep cu `_` și acest README sunt ignorate.
