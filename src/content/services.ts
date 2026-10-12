import type { StaticImageData } from "next/image";
import videoBts from "@/assets/services/video-behind-the-scenes.webp";

export type ServiceSummary = {
  id: "marketing-video" | "publicitate-ppc" | "dezvoltare-web";
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  tags: string[];
};

/** Short descriptions, taken from the original homepage. */
export const serviceSummaries: ServiceSummary[] = [
  {
    id: "marketing-video",
    index: "01",
    title: "Marketing video",
    shortTitle: "Video",
    summary:
      "Filmare la locația clientului cu aparatură profesională, editare profesionistă și o strategie clară de postare.",
    tags: ["Reels", "TikTok", "Video de prezentare", "Reclame video"],
  },
  {
    id: "publicitate-ppc",
    index: "02",
    title: "Publicitate PPC",
    shortTitle: "PPC",
    summary:
      "Campanii Google Ads, Meta Ads și TikTok Ads planificate, gestionate și optimizate în jurul unor obiective comerciale clare.",
    tags: ["Google Ads", "Meta Ads", "TikTok Ads"],
  },
  {
    id: "dezvoltare-web",
    index: "03",
    title: "Website-uri și magazine online",
    shortTitle: "Web",
    summary:
      "Website-uri de prezentare și magazine online clare, responsive și construite pentru a ghida vizitatorii spre solicitări sau cumpărături.",
    tags: ["Website de prezentare", "Magazin online", "Responsive"],
  },
];

export type Step = { title: string; text: string };

export const videoService = {
  eyebrow: "Marketing video",
  title: "Conținut video construit pentru atenție, claritate și distribuție.",
  paragraphs: [
    "Nu pornim direct cu filmarea. Clarificăm publicul, mesajul și acțiunea pe care trebuie să o provoace materialul. Apoi transformăm ideea într-un concept care poate fi filmat eficient și adaptat canalelor unde va fi publicat.",
    "Putem prelua întregul flux: strategie, structură, scripting, pregătirea filmării, producție la locație, editare, subtitrări, formate verticale sau orizontale și recomandări de publicare.",
  ],
  formats: ["Reels", "TikTok", "Video de prezentare", "Reclame video", "Conținut educațional", "Testimoniale"],
  steps: [
    {
      title: "Strategie și preproducție",
      text: "Obiective, audiență, direcție creativă, structură de conținut, scenariu, locație și plan de filmare.",
    },
    {
      title: "Producție la locație",
      text: "Filmare cu echipament profesional, compoziție, lumină, sunet și ghidaj pentru persoanele din cadru.",
    },
    {
      title: "Editare și adaptare",
      text: "Selecție cadre, montaj, ritm, sunet, subtitrări și exporturi adaptate fiecărei platforme.",
    },
    {
      title: "Distribuție",
      text: "Recomandări privind ordinea publicării, textele de însoțire și reutilizarea materialelor în campanii.",
    },
  ] satisfies Step[],
  cta: "Planifică o filmare",
  image: videoBts as StaticImageData,
  imageAlt: "Pregătirea unei filmări: telefon montat pe gimbal, pe o masă de lucru",
};

export const ppcService = {
  eyebrow: "Publicitate PPC",
  title: "Campanii plătite care urmăresc o conversie reală.",
  paragraphs: [
    "Definim ce înseamnă o conversie pentru afacerea ta, configurăm măsurarea și construim campaniile în jurul intenției utilizatorului. Optimizarea se bazează pe datele contului, nu pe presupuneri sau indicatori izolați.",
    "Gestionăm Google Ads, Meta Ads și TikTok Ads atunci când canalul se potrivește obiectivului, audienței și materialelor disponibile.",
  ],
  specialist: "Rus Bogdan · specialist PPC cu pregătire în Google Ads",
  platforms: ["Google Ads", "Meta Ads", "TikTok Ads"],
  configure: [
    "Structura campaniilor și gruparea intențiilor",
    "Conversii, evenimente și parametri de măsurare",
    "Audiențe, excluderi și remarketing",
    "Anunțuri, extensii și variante de mesaj",
    "Bugete, priorități și reguli de optimizare",
  ],
  track: [
    "Conversii și valoarea lor pentru business",
    "Costul per conversie sau achiziție",
    "Calitatea traficului și rata de conversie",
    "ROAS, când valoarea vânzărilor este disponibilă",
    "Evoluția rezultatelor în raport cu bugetul",
  ],
  reporting: [
    { title: "Context", text: "Obiectivul, perioada, audiența și punctul de plecare al contului." },
    { title: "Decizii", text: "Schimbările de structură, mesaje, licitare și pagini de destinație." },
    { title: "Rezultate", text: "Doar date verificate și aprobate de client, prezentate împreună cu contextul lor." },
  ] satisfies Step[],
  cta: "Solicită un audit",
};

export const webService = {
  eyebrow: "Web development",
  title: "Website-uri care transformă oferta într-un parcurs clar.",
  paragraphs: [
    "Definim mai întâi ce trebuie să înțeleagă și să facă vizitatorul. Pe această bază construim arhitectura paginilor, ierarhia mesajelor, designul responsive și componentele necesare.",
    "Livrăm website-uri de prezentare și magazine online pregătite pentru lansare, testate pe ecrane diferite și gândite pentru administrare și dezvoltare ulterioară.",
  ],
  offers: [
    {
      title: "Website de prezentare",
      text: "Pentru servicii, companii și branduri care au nevoie de o prezentare clară și de un traseu eficient spre contact.",
      items: ["Structură și wireframe", "Design responsive", "Pagini și formulare", "Optimizare tehnică de bază"],
    },
    {
      title: "Magazin online",
      text: "Pentru afaceri care trebuie să prezinte produse, să simplifice alegerea și să ofere un flux coerent de cumpărare.",
      items: ["Categorii și pagini de produs", "Coș și proces de comandă", "Plăți și opțiuni de livrare", "Testare înainte de lansare"],
    },
  ],
  cta: "Discută un website",
};

export const process: Step[] = [
  { title: "Clarificare", text: "Obiective, public, context, resurse disponibile și criterii de succes." },
  { title: "Direcție", text: "Propunerea de lucru, prioritățile, livrabilele și calendarul proiectului." },
  { title: "Execuție", text: "Producție, configurare sau dezvoltare, cu puncte clare de feedback." },
  { title: "Lansare", text: "Verificare finală, predare, publicare și pașii de optimizare ulterioară." },
];
