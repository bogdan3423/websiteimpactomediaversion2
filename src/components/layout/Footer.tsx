import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowUpRight } from "@/components/ui/icons";
import { legalNav, mainNav, site } from "@/content/site";
import { serviceSummaries } from "@/content/services";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="shell border-t border-line-dark pb-10 pt-[var(--section-tight)]">
        <div className="grid-site gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-8 max-w-sm text-ash">
              Agenție de marketing din Cluj-Napoca. Producție video, publicitate PPC și website-uri, construite ca un
              singur sistem.
            </p>
          </div>

          <div className="col-span-4 md:col-span-3 lg:col-span-3">
            <p className="type-label text-ash">Contact</p>
            <ul className="mt-5 space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-2 text-lg">
                  <span className="link-line">{site.email}</span>
                  <ArrowUpRight className="arrow-nudge text-sm" />
                </a>
              </li>
              <li>
                <a href={site.phone.href} className="link-line text-lg">
                  {site.phone.display}
                </a>
              </li>
              <li className="pt-2 text-ash">
                {site.city}, {site.country}
              </li>
            </ul>
          </div>

          <nav aria-label="Pagini" className="col-span-2 md:col-span-2 lg:col-span-2">
            <p className="type-label text-ash">Pagini</p>
            <ul className="mt-5 space-y-2">
              <li>
                <Link href="/" className="link-line">
                  Acasă
                </Link>
              </li>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Servicii" className="col-span-2 md:col-span-3 lg:col-span-2">
            <p className="type-label text-ash">Servicii</p>
            <ul className="mt-5 space-y-2">
              {serviceSummaries.map((service) => (
                <li key={service.id}>
                  <Link href={`/servicii#${service.id}`} className="link-line">
                    {service.shortTitle === "Web" ? "Website-uri" : service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-[var(--section-tight)] flex flex-col gap-6 border-t border-line-dark pt-6 text-sm text-ash lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.name}. Marcă operată de {site.legalName}, CUI {site.registry.cui}.
          </p>
          <nav aria-label="Informații legale">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
