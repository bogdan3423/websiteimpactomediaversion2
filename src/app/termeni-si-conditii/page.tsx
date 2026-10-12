import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { terms } from "@/content/legal/terms";
import { pageMetadata } from "@/lib/metadata";

const description = "Termenii de utilizare ai website-ului ImpactoMedia și cadrul general pentru solicitări, oferte și colaborări cu APONTI DIGITAL S.R.L.";

export const metadata: Metadata = pageMetadata({
  title: "Termeni și condiții | ImpactoMedia",
  description,
  path: "/termeni-si-conditii",
});

export default function Page() {
  return <LegalPage doc={terms} path="/termeni-si-conditii" description={description} />;
}
