import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowUpRight } from "@/components/ui/icons";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, graph, organizationSchema, webPageSchema } from "@/lib/structured-data";

const title = "Contact: telefon, e-mail și formular | ImpactoMedia";
const description =
  "Contactează ImpactoMedia pentru producție video, campanii PPC, website-uri de prezentare sau magazine online. Suntem în Cluj-Napoca.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          { ...webPageSchema({ path: "/contact", name: title, description }), "@type": "ContactPage" },
          breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
          organizationSchema(),
        )}
      />

      <PageHero
        breadcrumb="Contact"
        label={site.city}
        title="Hai să discutăm."
        intro="Ai nevoie de video, PPC sau un website nou? Spune-ne care este următorul obiectiv al afacerii tale."
      />

      <section className="shell pb-[var(--section)]" aria-label="Date de contact și formular">
        <div className="grid-site gap-y-16 border-t border-ink pt-[var(--section-tight)]">
          <aside className="col-span-4 md:col-span-8 lg:col-span-4" suppressHydrationWarning data-reveal>
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <a href={site.phone.href} className="group block border-b border-line pb-8" aria-label={`Sună ImpactoMedia la ${site.phone.display}`}>
                <span className="type-label text-graphite">Sună-ne direct</span>
                <span className="type-h2 mt-4 flex items-center gap-4">
                  <span className="link-line whitespace-nowrap">{site.phone.display}</span>
                  <ArrowUpRight className="arrow-nudge shrink-0 text-[0.6em]" />
                </span>
                <span className="mt-3 block text-graphite">Hai să ne auzim la un telefon.</span>
              </a>

              <dl className="divide-y divide-line">
                <div className="py-6">
                  <dt className="type-label text-graphite">E-mail</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${site.email}`} className="link-line text-xl">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="py-6">
                  <dt className="type-label text-graphite">Unde suntem</dt>
                  <dd className="mt-2 text-xl">
                    {site.city}, {site.country}
                  </dd>
                </div>
                <div className="py-6">
                  <dt className="type-label text-graphite">Companie</dt>
                  <dd className="mt-2 text-graphite">
                    {site.name} este marca operată de {site.legalName}
                    <br />
                    CUI {site.registry.cui} · Nr. Reg. Com. {site.registry.tradeRegister}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <div
            className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6"
            suppressHydrationWarning
            data-reveal
            style={{ "--reveal-delay": 140 } as React.CSSProperties}
          >
            <h2 className="type-h3 mb-10">Spune-ne despre proiectul tău</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
