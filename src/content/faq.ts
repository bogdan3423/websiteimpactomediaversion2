export type FaqItem = { question: string; answer: string };

/** Homepage FAQ, unchanged from the original website (also used for FAQPage JSON-LD). */
export const homeFaq: FaqItem[] = [
  {
    question: "Ce servicii de marketing oferă ImpactoMedia?",
    answer:
      "Serviciile noastre principale sunt producția video la locație, cu editare profesională și strategie de postare, campaniile PPC pe Google, Meta și TikTok, precum și website-urile de prezentare și magazinele online.",
  },
  {
    question: "Cât durează, de regulă, un proiect?",
    answer:
      "Durata depinde de volumul producției, locațiile de filmare, platformele de publicitate, cerințele website-ului și procesul de aprobare. Stabilim un calendar clar înainte de începerea proiectului.",
  },
  {
    question: "Fiecare plan de marketing este personalizat?",
    answer:
      "Da. Recomandările sunt adaptate brandului, audienței, obiectivelor, resurselor disponibile și bugetului aprobat.",
  },
  {
    question: "Cât costă un proiect?",
    answer:
      "Prețul este propus după definirea cerințelor de filmare, editare, publicitate sau dezvoltare web și a modelului de colaborare.",
  },
  {
    question: "Oferiți asistență continuă pentru campanii?",
    answer:
      "Raportarea și optimizarea PPC, producția video recurentă și mentenanța website-ului pot fi incluse în colaborarea convenită.",
  },
];

/** "Înainte să începem" questions from the original services page. */
export const servicesFaq: FaqItem[] = [
  {
    question: "Putem combina mai multe servicii?",
    answer: "Da. Video-ul, promovarea și website-ul pot fi planificate împreună atunci când susțin același obiectiv.",
  },
  {
    question: "Cum se stabilește oferta?",
    answer: "După ce definim obiectivul, volumul de lucru, livrabilele, calendarul și responsabilitățile fiecărei părți.",
  },
  {
    question: "Putem începe cu un proiect pilot?",
    answer:
      "Da. Pentru multe colaborări este util să începem cu un livrabil sau o perioadă clar delimitată și să extindem ulterior.",
  },
  {
    question: "De ce aveți nevoie din partea clientului?",
    answer:
      "Acces la informațiile relevante, materiale de brand, aprobări la timp și o persoană responsabilă pentru feedback.",
  },
];
