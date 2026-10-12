import type { Metadata } from "next";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { NumberedList } from "@/components/sections/NumberedList";
import { PageHero } from "@/components/sections/PageHero";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { StatsBand } from "@/components/sections/StatsBand";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitWords } from "@/components/motion/SplitWords";
import { JsonLd } from "@/components/ui/JsonLd";
import { capabilities, principles } from "@/content/agency";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, organizationSchema, webPageSchema } from "@/lib/structured-data";

const title = "Despre noi: echipa și modul de lucru | ImpactoMedia";
const description =
  "Cunoaște echipa ImpactoMedia și modul în care conectăm producția video, publicitatea PPC și dezvoltarea web în proiecte coerente.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/despre-noi" });

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph(
          { ...webPageSchema({ path: "/despre-noi", name: title, description }), "@type": "AboutPage" },
          breadcrumbSchema([{ name: "Despre noi", path: "/despre-noi" }]),
          organizationSchema(),
        )}
      />

      <PageHero
        breadcrumb="Despre noi"
        label={`${site.name} · ${site.city}`}
        title="Combinăm video, PPC și web pentru ca brandurile să comunice clar și să crească online."
      />

      {/* Story -------------------------------------------------------------------- */}
      <section className="shell pb-[var(--section)]" aria-labelledby="poveste-title">
        <div className="grid-site gap-y-10 border-t border-line pt-[var(--section-tight)]">
          <div className="col-span-4 md:col-span-8 lg:col-span-3" suppressHydrationWarning data-reveal="fade">
            <Eyebrow index="01">ImpactoMedia</Eyebrow>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
            <h2 id="poveste-title" className="type-h2" suppressHydrationWarning data-reveal="words">
              <SplitWords text="Marketingul funcționează cel mai bine atunci când mesajul, distribuția și experiența digitală susțin același obiectiv." />
            </h2>
            <div className="mt-12 grid gap-8 text-graphite md:grid-cols-2" suppressHydrationWarning data-reveal>
              <p>
                Din Cluj-Napoca, ajutăm brandurile să transforme o idee clară în materiale video profesioniste, campanii
                plătite bine direcționate și website-uri construite pentru acțiune.
              </p>
              <p>
                La ImpactoMedia, filmăm la locația clientului cu aparatură profesională, edităm materialele pentru
                platformele potrivite și stabilim strategia de postare. Gestionăm și campanii Google Ads, Meta Ads și
                TikTok Ads și dezvoltăm website-uri de prezentare și magazine online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities ------------------------------------------------------------- */}
      <section className="bg-ink text-paper" aria-labelledby="competente-title">
        <div className="shell section">
          <div className="grid-site gap-y-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-3" suppressHydrationWarning data-reveal="fade">
              <Eyebrow index="02" tone="dark">
                Ce facem
              </Eyebrow>
              <h2 id="competente-title" className="sr-only">
                Competențe
              </h2>
            </div>
            <ul className="col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4">
              {capabilities.map((capability, index) => (
                <li
                  key={capability}
                  className="type-h2 flex items-baseline justify-between gap-6 border-b border-line-dark py-4 first:border-t md:py-5"
                  suppressHydrationWarning data-reveal
                  style={{ "--reveal-delay": index * 50 } as React.CSSProperties}
                >
                  <span>{capability}</span>
                  <span className="type-label shrink-0 text-ash">{String(index + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Principles --------------------------------------------------------------- */}
      <section className="shell section" aria-labelledby="principii-title">
        <SectionIntro
          id="principii-title"
          index="03"
          label="Cum lucrăm"
          title="Construim fiecare colaborare în jurul obiectivului, resurselor disponibile și etapelor reale ale proiectului."
        />
        <div className="mt-[var(--section-tight)]">
          <NumberedList items={principles} columns={3} />
        </div>
      </section>

      {/* Team --------------------------------------------------------------------- */}
      <section className="border-t border-line" aria-labelledby="echipa-title">
        <div className="shell section">
          <SectionIntro
            id="echipa-title"
            index="04"
            label="Echipa"
            title="Cunoaște echipa"
            text="Echipa noastră reunește producția video, promovarea plătită și dezvoltarea web într-un singur proces colaborativ."
          />
          <div className="mt-[var(--section-tight)]">
            <TeamGrid />
          </div>
        </div>
      </section>

      {/* Figures and company facts -------------------------------------------- */}
      <section className="border-t border-line bg-paper-deep" aria-labelledby="date-title">
        <div className="shell section">
          <SectionIntro id="date-title" index="05" label="Pe scurt" title="Câteva repere." />
          <div className="mt-[var(--section-tight)]">
            <StatsBand />
          </div>
          <dl className="mt-16 grid gap-x-8 border-t border-line text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-4" suppressHydrationWarning data-reveal>
            {[
              ["Sediu", `${site.city}, ${site.country}`],
              ["Companie", site.legalName],
              ["E-mail", site.email],
              ["Telefon", site.phone.display],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-line py-5">
                <dt className="type-label text-graphite">{label}</dt>
                <dd className="mt-2">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ClosingCta
        kicker="Lucrăm împreună?"
        title="Pregătit să crești cu o direcție clară?"
        text="Spune-ne care este următorul obiectiv al afacerii tale."
      />
    </>
  );
}
