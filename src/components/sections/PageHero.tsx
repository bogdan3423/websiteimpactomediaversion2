import Link from "next/link";
import type { ReactNode } from "react";
import { afterWords, animatedTitle } from "@/components/motion/SplitWords";

type Props = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  breadcrumb: string;
  aside?: ReactNode;
};

/** Opening block shared by the inner pages: breadcrumb, large title, short intro. */
export function PageHero({ label, title, intro, breadcrumb, aside }: Props) {
  return (
    <section className="shell pb-[var(--section-tight)] pt-[clamp(2.5rem,1.5rem+5vw,6.5rem)]">
      <div className="flex items-center justify-between gap-6 border-b border-line pb-5">
        <nav aria-label="Breadcrumb">
          <ol className="type-label flex items-center gap-2 text-graphite">
            <li>
              <Link href="/" className="link-line">
                Acasă
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {breadcrumb}
            </li>
          </ol>
        </nav>
        <p className="type-label hidden text-graphite sm:block">{label}</p>
      </div>

      <div className="grid-site mt-[clamp(2.5rem,1.5rem+4vw,5.5rem)] gap-y-8">
        <h1 className="type-h1 col-span-4 md:col-span-8 lg:col-span-10">{animatedTitle(title)}</h1>
        {intro ? (
          <div
            className="hero-rise col-span-4 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-7"
            style={{ "--rise-delay": afterWords(title, 120) } as React.CSSProperties}
          >
            <div className="type-lead text-graphite">{intro}</div>
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
