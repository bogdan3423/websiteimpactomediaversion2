import type { Metadata } from "next";
import { ClientWall } from "@/components/sections/ClientWall";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { NumberedList } from "@/components/sections/NumberedList";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { StatsBand } from "@/components/sections/StatsBand";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink, TextLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { JsonLd } from "@/components/ui/JsonLd";
import { principles } from "@/content/agency";
import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { KineticHeading } from "@/components/sections/KineticHeading";
import { clients } from "@/content/clients";
import { TeamBadge } from "@/components/sections/TeamBadge";
import { homeFaq } from "@/content/faq";
import { pageMetadata } from "@/lib/metadata";
import { graph, organizationSchema, webPageSchema, websiteSchema } from "@/lib/structured-data";

const title = "Agenție de marketing în Cluj-Napoca: video, PPC și web | ImpactoMedia";
const description =
  "Agenție de marketing din Cluj-Napoca pentru producție video, campanii Google, Meta și TikTok Ads, website-uri de prezentare și magazine online.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd
        // No FAQPage markup: FAQ rich results are limited to government and health sites.
        data={graph(organizationSchema(), websiteSchema(), webPageSchema({ path: "/", name: title, description }))}
      />

      {/* Hero ---------------------------------------------------------------- */}
      <section className="shell pb-14 pt-6 md:pb-[var(--section)] md:pt-[clamp(2rem,1rem+4vw,5rem)]" aria-labelledby="hero-title">
        <div className="type-label flex items-center justify-between gap-6 border-b border-line pb-5 text-graphite">
          <span className="hero-rise">Agenție de marketing · Cluj-Napoca</span>
          <span className="hero-rise hidden sm:block" style={{ "--rise-delay": 80 } as React.CSSProperties}>
            Video <span className="px-1 text-signal">/</span> PPC <span className="px-1 text-signal">/</span> Web
          </span>
        </div>

        <div className="mt-8 md:mt-[clamp(3rem,2rem+5vw,7rem)]">
          <HeroHeadline />
        </div>

        <div className="mt-10 flex flex-col items-start text-left md:mt-0 md:items-center md:text-center">
          <p
            className="type-lead hero-rise max-w-2xl text-graphite md:mt-[clamp(2rem,1.5rem+2vw,3rem)]"
            style={{ "--rise-delay": 950 } as React.CSSProperties}
          >
            Suntem o echipă tânără din <span className="whitespace-nowrap">Cluj-Napoca</span>. Facem video și social media,
            campanii Google, Meta și TikTok Ads și website-uri, construite ca un sistem coerent pentru brandul tău.
          </p>

          <div
            className="hero-rise mt-8 flex w-full flex-col items-stretch gap-5 sm:w-auto sm:flex-row sm:items-center md:mt-10"
            style={{ "--rise-delay": 1080 } as React.CSSProperties}
          >
            <ButtonLink href="/contact" className="w-full sm:w-auto">
              Hai să creăm impact
            </ButtonLink>
            <TextLink href="/servicii" className="self-start sm:self-auto">
              Vezi serviciile
            </TextLink>
          </div>

          <div
            className="hero-rise mt-10 w-full border-t border-line pt-6 sm:w-auto md:mt-12"
            style={{ "--rise-delay": 1200 } as React.CSSProperties}
          >
            <TeamBadge />
          </div>
        </div>
      </section>

      {/* Phones: kinetic services ticker as the bridge into the next section. */}
      <div className="overflow-hidden border-y border-line md:hidden" aria-hidden="true">
        <div className="hero-ticker flex w-max py-4">
          {[0, 1].map((copy) => (
            <ul key={copy} className="type-label flex w-max shrink-0 items-center gap-6 pr-6 text-graphite">
              {["Marketing video", "Publicitate PPC", "Website-uri", "Magazine online", "Google Ads", "Meta Ads", "TikTok Ads"].map((item) => (
                <li key={item} className="flex shrink-0 items-center gap-6">
                  {item}
                  <span className="h-1.5 w-1.5 bg-signal" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Clients --------------------------------------------------------------- */}
      <section className="border-t border-line" aria-labelledby="clienti-title">
        <div className="shell section">
          <div className="flex flex-col items-start text-left md:items-center md:text-center">
            <div suppressHydrationWarning data-reveal="fade">
              <Eyebrow index="01">Clienți</Eyebrow>
            </div>
            <KineticHeading
              id="clienti-title"
              text="Branduri care"
              accent="ne-au ales deja."
              className="mt-8 w-full md:mt-10"
            />
            <p
              className="type-lead mt-8 max-w-xl text-graphite md:mt-10"
              suppressHydrationWarning data-reveal
              style={{ "--reveal-delay": 450 } as React.CSSProperties}
            >
              Afaceri locale și branduri în creștere, din domenii foarte diferite, de la imobiliare la ospitalitate.
            </p>
          </div>

          <div className="mt-[var(--section-tight)]">
            <ClientWall />
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
            suppressHydrationWarning data-reveal="fade"
          >
            <p className="type-label text-graphite">
              <span className="text-signal">{clients.length}</span> branduri · Cluj-Napoca și nu numai
            </p>
          </div>
        </div>
      </section>

      {/* Services -------------------------------------------------------------- */}
      <section className="bg-ink text-paper" aria-labelledby="servicii-title">
        <div className="shell section">
          <div suppressHydrationWarning data-reveal="fade">
            <Eyebrow index="02" tone="dark">
              Servicii
            </Eyebrow>
          </div>
          <KineticHeading
            id="servicii-title"
            text="Video care atrage. Reclame care țintesc."
            accent="Website-uri care vând."
            className="mt-8 md:mt-10"
          />
          <div className="grid-site mt-8 md:mt-12">
            <p
              className="type-lead col-span-4 text-ash md:col-span-6 lg:col-span-6 lg:col-start-7"
              suppressHydrationWarning data-reveal
              style={{ "--reveal-delay": 600 } as React.CSSProperties}
            >
              Trei servicii, <span className="text-signal">un singur plan</span>: conținutul video atrage atenția,
              campaniile Google, Meta și TikTok Ads îl duc la oamenii potriviți, iar website-ul transformă interesul
              în solicitări și vânzări.
            </p>
          </div>
          <div className="mt-[var(--section-tight)]">
            <ServiceIndex />
          </div>
          <div className="mt-10 flex justify-end">
            <TextLink href="/servicii">Detalii despre servicii</TextLink>
          </div>
        </div>
      </section>

      {/* Figures --------------------------------------------------------------- */}
      <section className="shell section" aria-labelledby="cifre-title">
        <SectionIntro
          id="cifre-title"
          index="03"
          label="Cifre"
          title="Video, promovare plătită și website-uri construite în jurul obiectivelor tale."
          text="Din Cluj-Napoca, ImpactoMedia reunește producția video profesională, campaniile PPC și dezvoltarea web într-o ofertă digitală coerentă."
        />
        <div className="mt-[var(--section-tight)]">
          <StatsBand />
        </div>
      </section>

      {/* Principles ------------------------------------------------------------ */}
      <section className="shell section" aria-labelledby="principii-title">
        <SectionIntro
          id="principii-title"
          index="04"
          label="De ce să ne alegi"
          title="Construim fiecare colaborare în jurul obiectivului, resurselor disponibile și etapelor reale ale proiectului."
        />
        <div className="mt-[var(--section-tight)]">
          <NumberedList items={principles} columns={3} />
        </div>
      </section>

      {/* Team ------------------------------------------------------------------ */}
      <section className="border-t border-line" aria-labelledby="echipa-title">
        <div className="shell section">
          <SectionIntro
            id="echipa-title"
            index="05"
            label="Echipa"
            title="Oamenii care lucrează la proiectul tău."
            text="Echipa noastră reunește producția video, promovarea plătită și dezvoltarea web într-un singur proces colaborativ."
          />
          <div className="mt-[var(--section-tight)]">
            <TeamGrid />
          </div>
          <div className="mt-12 flex justify-end">
            <TextLink href="/despre-noi">Mai multe despre noi</TextLink>
          </div>
        </div>
      </section>

      {/* FAQ ------------------------------------------------------------------- */}
      <section className="border-t border-line" aria-labelledby="faq-title">
        <div className="shell section grid-site gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]" suppressHydrationWarning data-reveal>
              <Eyebrow index="06">Întrebări frecvente</Eyebrow>
              <h2 id="faq-title" className="type-h2 mt-6">
                Ce ne întreabă clienții des.
              </h2>
              <p className="mt-6 max-w-sm text-graphite">
                Cum abordăm producția video, publicitatea plătită și dezvoltarea web pentru diferite nevoi ale
                afacerii.
              </p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6" suppressHydrationWarning data-reveal>
            <Accordion items={homeFaq} name="faq-acasa" />
          </div>
        </div>
      </section>

      <ClosingCta
        kicker="Contact"
        title="Pregătit să crești cu o direcție clară?"
        text="Spune-ne dacă ai nevoie de conținut video, campanii PPC, un website de prezentare sau un magazin online."
      />
    </>
  );
}
