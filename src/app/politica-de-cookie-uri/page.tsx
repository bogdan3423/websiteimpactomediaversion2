import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { cookies } from "@/content/legal/cookies";
import { pageMetadata } from "@/lib/metadata";

const description = "Informații despre cookie-urile, stocarea locală și resursele tehnice externe utilizate de website-ul ImpactoMedia.";

export const metadata: Metadata = pageMetadata({
  title: "Politica de cookie-uri | ImpactoMedia",
  description,
  path: "/politica-de-cookie-uri",
});

export default function Page() {
  return <LegalPage doc={cookies} path="/politica-de-cookie-uri" description={description} />;
}
