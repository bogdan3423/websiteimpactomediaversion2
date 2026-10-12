import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import type { LegalDocument } from "@/content/legal/types";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/structured-data";

type Props = { doc: LegalDocument; path: string; description: string };

/**
 * Shared template for the legal pages. The HTML comes from the original
 * website's legal texts (trusted, generated at build time from local files).
 */
export function LegalPage({ doc, path, description }: Props) {
  return (
    <>
      <JsonLd
        data={graph(webPageSchema({ path, name: `${doc.title} | ImpactoMedia`, description }), breadcrumbSchema([{ name: doc.title, path }]))}
      />

      <PageHero breadcrumb={doc.title} label="Informații legale" title={doc.title} intro={doc.intro} />

      <section className="shell pb-[var(--section)]">
        <div className="grid-site gap-y-12 border-t border-ink pt-10">
          <aside className="col-span-4 md:col-span-8 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="type-label text-graphite">{doc.updated}</p>

              <details className="group mt-8 border-y border-line lg:hidden">
                <summary className="type-label flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                  Cuprins
                  <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                    ↓
                  </span>
                </summary>
                <ol className="space-y-2 pb-5">
                  {doc.toc.map((item, index) => (
                    <li key={item.id} className="flex gap-3">
                      <span className="type-label pt-1 text-ash">{String(index + 1).padStart(2, "0")}</span>
                      <a href={`#${item.id}`} className="link-line">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <nav aria-label={`Cuprins: ${doc.title}`} className="mt-10 hidden lg:block">
                <p className="type-label text-graphite">Cuprins</p>
                <ol className="mt-5 space-y-2.5 text-[0.9375rem]">
                  {doc.toc.map((item, index) => (
                    <li key={item.id} className="flex gap-3">
                      <span className="type-label pt-1 text-ash">{String(index + 1).padStart(2, "0")}</span>
                      <a href={`#${item.id}`} className="link-line">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
            <div className="border-l-2 border-signal bg-surface px-6 py-6 md:px-8">
              <h2 className="type-h3">{doc.summaryTitle}</h2>
              <div className="mt-3 max-w-2xl text-graphite" dangerouslySetInnerHTML={{ __html: doc.summaryHtml }} />
            </div>
            <article className="prose-legal mt-14 [&_section]:scroll-mt-[calc(var(--header-h)+1.5rem)]" dangerouslySetInnerHTML={{ __html: doc.bodyHtml }} />
          </div>
        </div>
      </section>
    </>
  );
}
