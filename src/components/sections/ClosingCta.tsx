import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";
import { afterWords, animatedTitle } from "@/components/motion/SplitWords";

type Props = {
  kicker: string;
  title: ReactNode;
  text?: string;
  cta?: { label: string; href: string };
};

/** Dark closing band: one clear next step plus the direct phone/e-mail routes. */
export function ClosingCta({ kicker, title, text, cta = { label: "Hai să discutăm", href: "/contact" } }: Props) {
  return (
    <section className="bg-ink text-paper" aria-labelledby="closing-title">
      <div className="shell section">
        <div className="grid-site gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <p className="type-label text-ash" suppressHydrationWarning data-reveal="fade">
              {kicker}
            </p>
            <h2 id="closing-title" className="type-h1 mt-6" suppressHydrationWarning data-reveal="words">
              {animatedTitle(title)}
            </h2>
            {text ? (
              <p
                className="type-lead mt-6 max-w-xl text-ash"
                suppressHydrationWarning
                data-reveal
                style={{ "--reveal-delay": afterWords(title) } as React.CSSProperties}
              >
                {text}
              </p>
            ) : null}
          </div>
          <div
            className="col-span-4 flex flex-col justify-end gap-8 md:col-span-5 lg:col-span-3 lg:col-start-10"
            suppressHydrationWarning data-reveal
            style={{ "--reveal-delay": afterWords(title, 300) } as React.CSSProperties}
          >
            <ButtonLink href={cta.href} variant="solid-inverse" className="w-full">
              {cta.label}
            </ButtonLink>
            <div className="space-y-1 border-t border-line-dark pt-6">
              <p className="type-label text-ash">Sau direct</p>
              <a href={site.phone.href} className="link-line block w-fit text-xl">
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="link-line block w-fit text-xl">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
