import type { StaticImageData } from "next/image";
import bogdan from "@/assets/team/bogdan-rus.webp";
import irina from "@/assets/team/irina-blaga.webp";
import vlad from "@/assets/team/vlad-potra.webp";

/** Verified figures from the original homepage ("Cifre și informații"). */
export const stats = [
  { value: "50+", label: "Producții video realizate pentru campaniile clienților", tag: "Video" },
  { value: "60K+ €", label: "Bugete gestionate în campanii de publicitate plătită", tag: "PPC" },
  { value: "25+", label: "Website-uri de prezentare și magazine online realizate", tag: "Web" },
];

/** "De ce să ne alegi" principles from the original homepage. */
export const principles = [
  {
    title: "Totul lucrează împreună",
    text: "Video-ul, campaniile PPC și website-ul sunt planificate ca părți ale aceleiași experiențe, nu ca livrabile izolate.",
  },
  {
    title: "Strategie înainte de execuție",
    text: "Pornim de la public, obiectiv și acțiunea dorită, apoi alegem canalele și execuția potrivite.",
  },
  {
    title: "Proces clar și colaborativ",
    text: "Stabilim pașii, responsabilitățile și punctele de feedback, astfel încât proiectul să avanseze predictibil.",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  image: StaticImageData;
  alt: string;
  position?: string;
};

/** Real team members, names and roles from the original website. */
export const team: TeamMember[] = [
  {
    name: "Rus Bogdan",
    role: "Coordonator proiecte și specialist PPC",
    image: bogdan,
    alt: "Rus Bogdan, coordonator proiecte și specialist PPC la ImpactoMedia",
    position: "50% 35%",
  },
  {
    name: "Irina Blaga",
    role: "Specialist creativ și fotografie",
    image: irina,
    alt: "Irina Blaga, specialist creativ și fotografie, ținând un aparat foto",
    position: "50% 30%",
  },
  {
    name: "Vlad Potra",
    role: "Actor și specialist creativ",
    image: vlad,
    alt: "Vlad Potra, actor și specialist creativ la ImpactoMedia",
    position: "50% 25%",
  },
];

/** Capability keywords listed on the original "Despre noi" page. */
export const capabilities = [
  "Marketing video",
  "Editare profesională",
  "Google Ads",
  "Meta Ads",
  "TikTok Ads",
  "Website-uri de prezentare",
  "Magazine online",
];
