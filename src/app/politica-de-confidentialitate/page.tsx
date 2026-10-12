import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacy } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/metadata";

const description = "Află cum ImpactoMedia și APONTI DIGITAL S.R.L. colectează, utilizează, protejează și păstrează datele personale transmise prin website.";

export const metadata: Metadata = pageMetadata({
  title: "Politica de confidențialitate | ImpactoMedia",
  description,
  path: "/politica-de-confidentialitate",
});

export default function Page() {
  return <LegalPage doc={privacy} path="/politica-de-confidentialitate" description={description} />;
}
