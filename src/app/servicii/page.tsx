import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { NumberedList } from "@/components/sections/NumberedList";
import { PageHero } from "@/components/sections/PageHero";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { JsonLd } from "@/components/ui/JsonLd";
import { servicesFaq } from "@/content/faq";
import { ppcService, process, serviceSummaries, videoService, webService } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { keepHyphenated } from "@/lib/typography";
import { SplitWords } from "@/components/motion/SplitWords";
import { absoluteUrl } from "@/lib/site-url";
import { breadcrumbSchema, graph, organizationId, webPageSchema } from "@/lib/structured-data";

const title = "Servicii de marketing video, PPC și web | ImpactoMedia";
const description =
  "Descoperă serviciile ImpactoMedia: producție și editare video, Google Ads, Meta Ads, TikTok Ads, website-uri de prezentare și magazine online.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/servicii" });

function ServiceHeader({ index, eyebrow, title, tone = "light" }: { index: string; eyebrow: string; title: string; tone?: "light" | "dark" }) {
  return (
    <div>
      <div suppressHydrationWarning data-reveal="fade">
        <Eyebrow index={index} tone={tone}>
          {eyebrow}
        </Eyebrow>
      </div>
      <h2 className="type-h1 mt-8 max-w-[18ch]" suppressHydrationWarning data-reveal="words">
        <SplitWords text={title} />
      </h2>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ path: "/servicii", name: title, description }),
          breadcrumbSchema([{ name: "Servicii", path: "/servicii" }]),
          ...serviceSummaries.map((service) => ({
            "@type": "Service",
            name: service.title,
            description: service.summary,
            provider: { "@id": organizationId },
            areaServed: "România",
            url: absoluteUrl(`/servicii#${service.id}`),
          })),
        )}
      />

      <PageHero
        breadcrumb="Servicii"
        label="Video · PPC · Web"
        title="Servicii"
        intro="De la primul mesaj până la conversie, conectăm conținutul, promovarea și experiența digitală."
      />

      {/* In-page index */}
      <nav aria-label="Serviciile noastre" className="shell">
        <ul className="grid border-t border-line md:grid-cols-3">
          {serviceSummaries.map((service, index) => (
            <li key={service.id} className={`border-b border-line ${index > 0 ? "md:border-l md:pl-6" : ""}`}>
              <a href={`#${service.id}`} className="group flex items-center justify-between gap-6 py-5 md:pr-6">
                <span className="flex items-baseline gap-4">
                  <span className="type-label text-signal">{service.index}</span>
                  <span className="link-line type-h4">{service.title}</span>
                </span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 01 Video ------------------------------------------------------------ */}
      <section id="marketing-video" className="shell section scroll-mt-[var(--header-h)]" aria-label="Marketing video">
        <div className="grid-site gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <ServiceHeader index="01" eyebrow={videoService.eyebrow} title={videoService.title} />
            <div className="mt-10 max-w-xl space-y-5 text-graphite" suppressHydrationWarning data-reveal>
              {videoService.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10" suppressHydrationWarning data-reveal>
              <p className="type-label text-graphite">Formate</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {videoService.formats.map((format) => (
                  <li key={format} className="border border-line px-3 py-1.5 text-[0.9375rem]">
                    {format}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12" suppressHydrationWarning data-reveal>
              <ButtonLink href="/contact">{videoService.cta}</ButtonLink>
            </div>
          </div>
          <figure className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep" suppressHydrationWarning data-reveal="media">
              <Image
                src={videoService.image}
                alt={videoService.imageAlt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 38vw, (min-width: 768px) 70vw, 92vw"
                className="object-cover"
                style={{ objectPosition: "50% 45%" }}
              />
            </div>
            <figcaption className="type-label mt-3 text-graphite">Din culisele unei producții ImpactoMedia</figcaption>
          </figure>
        </div>

        <div className="mt-[var(--section-tight)]">
          <h3 className="type-label mb-8 text-graphite">Cum lucrăm la un material video</h3>
          <NumberedList items={videoService.steps} columns={4} headingLevel="h4" />
        </div>
      </section>

      {/* 02 PPC -------------------------------------------------------------- */}
      <section id="publicitate-ppc" className="scroll-mt-[var(--header-h)] bg-ink text-paper" aria-label="Publicitate PPC">
        <div className="shell section">
          <div className="grid-site gap-y-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <ServiceHeader index="02" eyebrow={ppcService.eyebrow} title={ppcService.title} tone="dark" />
            </div>
            <div className="col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:pt-16" suppressHydrationWarning data-reveal>
              <div className="space-y-5 text-ash">
                {ppcService.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-8 border-l-2 border-signal pl-4 text-paper">{ppcService.specialist}</p>
            </div>
          </div>

          <ul className="type-h2 mt-[var(--section-tight)] flex flex-wrap gap-x-8 gap-y-2 border-y border-line-dark py-8 text-paper" aria-label="Platforme">
            {ppcService.platforms.map((platform, index) => (
              <li key={platform} className="flex items-center gap-8" suppressHydrationWarning data-reveal style={{ "--reveal-delay": index * 90 } as React.CSSProperties}>
                {platform}
                {index < ppcService.platforms.length - 1 ? (
                  <span aria-hidden="true" className="h-2 w-2 bg-signal" />
                ) : null}
              </li>
            ))}
          </ul>

          <div className="mt-[var(--section-tight)] grid gap-14 md:grid-cols-2">
            {[
              { title: "Ce configurăm", items: ppcService.configure },
              { title: "Ce urmărim", items: ppcService.track },
            ].map((group) => (
              <div key={group.title} suppressHydrationWarning data-reveal>
                <h3 className="type-h3">{group.title}</h3>
                <ul className="mt-6 border-t border-line-dark">
                  {group.items.map((item, index) => (
                    <li key={item} className="flex gap-5 border-b border-line-dark py-4">
                      <span className="type-label pt-1 text-ash">{String(index + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-[var(--section-tight)]">
            <h3 className="type-label mb-8 text-ash">Cum raportăm</h3>
            <NumberedList items={ppcService.reporting} columns={3} tone="dark" headingLevel="h4" />
          </div>

          <div className="mt-14" suppressHydrationWarning data-reveal>
            <ButtonLink href="/contact" variant="solid-inverse">
              {ppcService.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 03 Web -------------------------------------------------------------- */}
      <section id="dezvoltare-web" className="shell section scroll-mt-[var(--header-h)]" aria-label="Website-uri și magazine online">
        <div className="grid-site gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <ServiceHeader index="03" eyebrow={webService.eyebrow} title={webService.title} />
          </div>
          <div className="col-span-4 space-y-5 text-graphite md:col-span-6 lg:col-span-4 lg:col-start-9 lg:pt-16" suppressHydrationWarning data-reveal>
            {webService.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-[var(--section-tight)] grid border-t border-ink md:grid-cols-2">
          {webService.offers.map((offer, index) => (
            <article
              key={offer.title}
              className={`py-10 ${index > 0 ? "border-t border-line md:border-l md:border-t-0 md:pl-10" : "md:pr-10"}`}
              suppressHydrationWarning data-reveal
              style={{ "--reveal-delay": index * 100 } as React.CSSProperties}
            >
              <h3 className="type-h2">{keepHyphenated(offer.title)}</h3>
              <p className="mt-5 max-w-md text-graphite">{offer.text}</p>
              <ul className="mt-8 space-y-3">
                {offer.items.map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-6" suppressHydrationWarning data-reveal>
          <ButtonLink href="/contact">{webService.cta}</ButtonLink>
        </div>
      </section>

      {/* Process -------------------------------------------------------------- */}
      <section className="border-t border-line bg-paper-deep" aria-labelledby="proces-title">
        <div className="shell section">
          <SectionIntro
            id="proces-title"
            label="Proces comun"
            title="Un singur fir logic, indiferent de serviciu."
            text="Fiecare proiect are livrabile diferite, dar deciziile urmează aceeași ordine."
          />
          <div className="mt-[var(--section-tight)]">
            <NumberedList items={process} columns={4} />
          </div>
        </div>
      </section>

      {/* FAQ -------------------------------------------------------------------- */}
      <section className="shell section grid-site gap-y-12" aria-labelledby="inainte-title">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <div suppressHydrationWarning data-reveal="fade">
            <Eyebrow>Întrebări frecvente</Eyebrow>
          </div>
          <h2 id="inainte-title" className="type-h2 mt-6" suppressHydrationWarning data-reveal="words">
            <SplitWords text="Înainte să începem" />
          </h2>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6" suppressHydrationWarning data-reveal>
          <Accordion items={servicesFaq} name="faq-servicii" />
        </div>
      </section>

      <ClosingCta
        kicker="Ai un obiectiv concret sau încă definești direcția?"
        title="Spune-ne ce vrei să construiești."
      />
    </>
  );
}
