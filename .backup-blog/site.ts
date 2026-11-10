/**
 * Company facts reused across the website. All values come from the original
 * ImpactoMedia website (contact details, legal pages and SEO configuration).
 */
export const site = {
  name: "ImpactoMedia",
  legalName: "APONTI DIGITAL S.R.L.",
  description:
    "Agenție de marketing din Cluj-Napoca specializată în producție video, publicitate PPC și dezvoltare web.",
  productionUrl: "https://impactomedia.ro",
  email: "contact@impactomedia.ro",
  /**
   * Contact form endpoint (FormSubmit AJAX, https://formsubmit.co). No account or key:
   * the very first submission sends an "Activate Form" e-mail to contact@impactomedia.ro;
   * after that one click every message is delivered there. After activation FormSubmit
   * also offers a random alias that can replace the address below to hide it from bots.
   */
  formEndpoint: "https://formsubmit.co/ajax/contact@impactomedia.ro",
  phone: {
    display: "+40 748 030 566",
    href: "tel:+40748030566",
    e164: "+40748030566",
  },
  city: "Cluj-Napoca",
  country: "România",
  address: {
    street: "Str. București nr. 64, bl. D15, sc. 3, et. 3, ap. 65",
    locality: "Cluj-Napoca",
    region: "Cluj",
    countryCode: "RO",
  },
  registry: {
    cui: "55369570",
    tradeRegister: "J2026048231002",
  },
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Servicii", href: "/servicii" },
  { label: "Despre noi", href: "/despre-noi" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Termeni și condiții", href: "/termeni-si-conditii" },
  { label: "Politica de confidențialitate", href: "/politica-de-confidentialitate" },
  { label: "Politica de cookie-uri", href: "/politica-de-cookie-uri" },
];
