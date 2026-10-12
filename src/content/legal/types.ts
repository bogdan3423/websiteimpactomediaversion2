export type LegalDocument = {
  title: string;
  intro: string;
  updated: string;
  summaryTitle: string;
  summaryHtml: string;
  toc: Array<{ id: string; label: string }>;
  bodyHtml: string;
};
