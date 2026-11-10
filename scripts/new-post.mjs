#!/usr/bin/env node
/**
 * Creates a new blog article from the template.
 *
 *   npm run blog:new -- "Titlul articolului"
 *   npm run blog:new -- "Titlul articolului" --categorie publicitate-ppc --autor rus-bogdan
 *
 * Writes content/blog/<slug>.md (as a draft) and creates public/blog/<slug>/ for its images.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args.splice(i, 2)[1] : fallback;
};
const category = option("categorie", "publicitate-ppc");
const author = option("autor", "rus-bogdan");
const title = args.join(" ").trim();
if (!title) {
  console.error('Scrie titlul: npm run blog:new -- "Titlul articolului"');
  process.exit(1);
}

const slug = title
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .split("-")
  .slice(0, 9)
  .join("-");

const file = `content/blog/${slug}.md`;
if (existsSync(file)) {
  console.error(`Există deja ${file}`);
  process.exit(1);
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bucharest" }).format(new Date());

writeFileSync(
  file,
  `---
title: "${title.replace(/"/g, '\\"')}"
# seoTitle: "Titlu mai scurt pentru Google (max. 60 caractere)"
description: "Rezumatul din Google: 120-160 de caractere, cu expresia principală și un motiv clar de a da click."
date: ${today}
category: ${category}
tags: []
author: ${author}
# cover: /blog/${slug}/cover.jpg
# coverAlt: "Descrierea imaginii de copertă"
draft: true
---

Primul paragraf: răspunde direct la întrebarea din titlu și folosește expresia principală.

## Prima secțiune

Text.

## A doua secțiune

Text, cu un link către [serviciul potrivit](/servicii#publicitate-ppc).

## Întrebări frecvente

### Întrebare?

Răspuns scurt.
`,
);
mkdirSync(`public/blog/${slug}`, { recursive: true });
console.log(`Creat: ${file}\nImagini: public/blog/${slug}/\nArticolul este ciornă (draft: true) până îl publici.`);
