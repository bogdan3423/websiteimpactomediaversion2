import type { StaticImageData } from "next/image";
import { team } from "@/content/agency";

/**
 * Blog configuration: categories and authors. Articles themselves live as
 * Markdown files in content/blog (see content/blog/README.md).
 */

export const blogInfo = {
  title: "Blog de marketing: video, PPC și website-uri | ImpactoMedia",
  description:
    "Articole practice de la ImpactoMedia despre producție video, campanii Google, Meta și TikTok Ads, website-uri de prezentare și magazine online.",
  heading: "Idei practice despre video, reclame și website-uri.",
  intro:
    "Ghiduri scurte și aplicate, scrise din proiectele noastre: ce funcționează în campaniile Google, Meta și TikTok Ads, cum planifici conținutul video și cum construiești un website care aduce clienți.",
  postsPerPage: 12,
};

export type BlogCategory = {
  slug: string;
  name: string;
  /** Short label on cards and image placeholders. */
  short: string;
  /** Meta description of the category page (unique, 50-160 characters). */
  description: string;
  /** Visible introduction on the category page. */
  intro: string;
  /** Contextual call to action shown under each article of this category. */
  service: { href: string; title: string; text: string };
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "publicitate-ppc",
    name: "Publicitate PPC",
    short: "PPC",
    description:
      "Articole despre Google Ads, Meta Ads și TikTok Ads: structura campaniilor, bugete, licitare, urmărirea conversiilor și optimizare.",
    intro:
      "Google Ads, Meta Ads și TikTok Ads explicate pe înțelesul unei afaceri: cum structurezi campaniile, cât bugetezi și cum măsori ce aduce fiecare leu.",
    service: {
      href: "/servicii#publicitate-ppc",
      title: "Vrei campanii care aduc solicitări reale?",
      text: "Gestionăm campanii Google, Meta și TikTok Ads construite în jurul unei conversii clare, nu al click-urilor.",
    },
  },
  {
    slug: "marketing-video",
    name: "Marketing video",
    short: "Video",
    description:
      "Ghiduri despre marketing video pentru afaceri: idei de conținut, filmare la locație, editare și formate pentru reclame și social media.",
    intro:
      "De la idee la distribuție: cum planifici, filmezi și editezi conținut video care atrage atenția și susține vânzările.",
    service: {
      href: "/servicii#marketing-video",
      title: "Ai nevoie de conținut video pentru brandul tău?",
      text: "Filmăm la locația ta cu aparatură profesională și adaptăm materialele pentru fiecare platformă.",
    },
  },
  {
    slug: "website-uri",
    name: "Website-uri și magazine online",
    short: "Web",
    description:
      "Sfaturi despre website-uri de prezentare și magazine online: structură, viteză, SEO, pagini de destinație și conversie.",
    intro:
      "Cum construiești un website sau un magazin online clar, rapid și ușor de găsit, care transformă vizitatorii în clienți.",
    service: {
      href: "/servicii#dezvoltare-web",
      title: "Pregătești un website sau un magazin online?",
      text: "Dezvoltăm website-uri de prezentare și magazine online construite pentru claritate, viteză și conversie.",
    },
  },
  {
    slug: "social-media",
    name: "Social media",
    short: "Social",
    description:
      "Articole despre social media pentru afaceri: strategie de conținut, calendar de postare și formate care funcționează pe Instagram, Facebook și TikTok.",
    intro:
      "Strategie de conținut, ritm de postare și formate care țin publicul aproape pe Instagram, Facebook și TikTok.",
    service: {
      href: "/servicii#marketing-video",
      title: "Vrei conținut constant pentru social media?",
      text: "Producem video și stabilim strategia de postare, astfel încât fiecare material să aibă un rol clar.",
    },
  },
  {
    slug: "strategie",
    name: "Strategie de marketing",
    short: "Strategie",
    description:
      "Strategie de marketing pentru afaceri locale și branduri în creștere: obiective, alegerea canalelor, bugete și măsurarea rezultatelor.",
    intro:
      "Cum alegi canalele potrivite, cum stabilești obiective realiste și cum legi video, reclamele și website-ul într-un singur plan.",
    service: {
      href: "/servicii",
      title: "Vrei un plan care leagă video, reclamele și website-ul?",
      text: "Pornim de la obiectivul afacerii și construim împreună un sistem coerent de marketing.",
    },
  },
];

export type BlogAuthor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: StaticImageData;
};

function member(name: string) {
  const found = team.find((person) => person.name === name);
  if (!found) throw new Error(`Autor necunoscut în echipă: ${name}`);
  return found;
}

export const blogAuthors: BlogAuthor[] = [
  {
    slug: "rus-bogdan",
    name: "Rus Bogdan",
    role: member("Rus Bogdan").role,
    bio: "Coordonează proiectele ImpactoMedia și campaniile de publicitate plătită pe Google, Meta și TikTok.",
    image: member("Rus Bogdan").image,
  },
  {
    slug: "irina-blaga",
    name: "Irina Blaga",
    role: member("Irina Blaga").role,
    bio: "Lucrează la partea creativă și de fotografie a proiectelor ImpactoMedia.",
    image: member("Irina Blaga").image,
  },
  {
    slug: "vlad-potra",
    name: "Vlad Potra",
    role: member("Vlad Potra").role,
    bio: "Actor și specialist creativ în producțiile video ImpactoMedia.",
    image: member("Vlad Potra").image,
  },
];
