import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { serviceSummaries } from "@/content/services";
import { keepHyphenated } from "@/lib/typography";

/**
 * Homepage service index: three full-width rows instead of three cards.
 * The whole row is the link; hover shifts the title and reveals the arrow.
 */
export function ServiceIndex() {
  return (
    <ul className="border-t border-line-dark">
      {serviceSummaries.map((service, index) => (
        <li key={service.id} suppressHydrationWarning data-reveal style={{ "--reveal-delay": index * 90 } as React.CSSProperties}>
          <Link
            href={`/servicii#${service.id}`}
            className="group grid-site relative gap-y-4 border-b border-line-dark py-8 transition-colors duration-300 md:py-10"
          >
            <span className="type-label col-span-4 text-signal md:col-span-1 md:pt-3">{service.index}</span>
            <h3 className="type-h2 col-span-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:col-span-7 lg:col-span-5">
              {keepHyphenated(service.title)}
            </h3>
            <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-4 lg:col-start-7">
              <p className="text-ash transition-colors duration-300 group-hover:text-paper">{service.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ash">
                {service.tags.map((tag) => (
                  <li key={tag} className="flex items-center gap-4">
                    <span aria-hidden="true" className="h-1 w-1 bg-signal" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <span
              aria-hidden="true"
              className="col-span-4 hidden items-start justify-end pt-2 md:flex md:col-span-1 md:col-start-8 lg:col-span-1 lg:col-start-12"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-line-dark transition-colors duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                <ArrowRight className="arrow-nudge arrow-nudge-right" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
