import type { Metadata } from "next";
import { ButtonLink, TextLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: { absolute: "Pagina nu a fost găsită | ImpactoMedia" },
  description: "Pagina solicitată nu există. Revino la pagina principală ImpactoMedia sau consultă serviciile agenției.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="shell flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-[var(--section-tight)]">
      <p className="type-label text-signal">Eroare 404</p>
      <h1 className="type-display mt-8 max-w-[14ch]">Pagina nu a fost găsită.</h1>
      <p className="type-lead mt-8 max-w-xl text-graphite">
        Adresa poate fi greșită sau pagina a fost mutată în noua versiune a website-ului.
      </p>
      <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <ButtonLink href="/">Înapoi la pagina principală</ButtonLink>
        <TextLink href="/servicii">Vezi serviciile</TextLink>
      </div>
    </section>
  );
}
