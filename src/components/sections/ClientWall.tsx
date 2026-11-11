import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { clients } from "@/content/clients";

/** Footprint per logo shape so very different proportions read at a similar visual weight. */
const sizes = {
  wide: "max-h-9 max-w-[78%] md:max-h-10 lg:max-h-11",
  medium: "max-h-12 max-w-[62%] md:max-h-14",
  square: "max-h-16 max-w-[44%] md:max-h-[4.5rem]",
  tall: "max-h-20 max-w-[50%] md:max-h-24",
};

/** Columns per breakpoint: phones 2, tablets 4, desktop 6. */
const columns = { base: 2, md: 4, lg: 6 } as const;

/** Cells the closing CTA spans so the last row is always complete. */
function ctaSpan(cols: number) {
  const rest = clients.length % cols;
  return rest === 0 ? cols : cols - rest;
}

/**
 * Client logos on the same hairline grid as the principles and figures: every
 * logo in its own sharp cell, no numbering. On devices with hover the wall
 * reads calm and monochrome; a cell lights up on hover, the logo returns to its
 * own colours and the name slides in. The last row is closed by an ink CTA panel
 * that turns signal orange on hover, like the solid button.
 */
export function ClientWall() {
  const spans = {
    "--cta-base": ctaSpan(columns.base),
    "--cta-md": ctaSpan(columns.md),
    "--cta-lg": ctaSpan(columns.lg),
  } as React.CSSProperties;

  return (
    <ul className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4 lg:grid-cols-6" style={spans}>
      {clients.map((client, index) => (
        <li
          key={client.name}
          className="client-cell group relative flex aspect-[4/3] items-center justify-center border-b border-r border-line bg-paper md:aspect-[3/2]"
          suppressHydrationWarning
          data-reveal
          style={{ "--reveal-delay": (index % 6) * 70 + Math.floor(index / 6) * 110 } as React.CSSProperties}
        >
          <span aria-hidden="true" className="client-dot absolute right-4 top-4 h-1.5 w-1.5 bg-signal md:right-5 md:top-5" />

          <Image
            src={client.logo}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            sizes="(min-width: 1024px) 200px, (min-width: 768px) 22vw, 42vw"
            className={`client-logo h-auto w-auto object-contain ${sizes[client.shape]}`}
          />
        </li>
      ))}

      <li
        className="col-span-(--cta-base) border-b border-r border-line md:col-span-(--cta-md) lg:col-span-(--cta-lg)"
        suppressHydrationWarning
        data-reveal
        style={{ "--reveal-delay": 260 } as React.CSSProperties}
      >
        {/* Phones: a quiet, centred paper cell like the logos around it (ink only while pressed).
            From tablets up, where it spans several cells, it becomes the ink panel. */}
        <Link
          href="/contact"
          className="group flex h-full flex-col items-center justify-center gap-4 bg-paper p-4 text-center text-ink transition-colors duration-300 active:bg-ink active:text-paper md:min-h-[9rem] md:gap-6 md:bg-ink md:p-5 md:text-paper md:items-stretch md:justify-between md:text-left md:hover:bg-signal lg:min-h-0"
        >
          <span className="type-label hidden items-center gap-2.5 text-ash transition-colors duration-300 md:flex md:group-hover:text-paper">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal transition-colors duration-300 md:h-2 md:w-2 md:group-hover:bg-paper" />
            Următorul brand
          </span>
          <span className="flex flex-col items-center gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
            <span className="max-w-[14ch] font-display text-[1.05rem] leading-[1.12] font-[560] tracking-[-0.012em] md:text-[1.4rem] lg:text-[clamp(1.15rem,0.6rem+0.9vw,1.45rem)]">
              Brandul tău poate fi aici.
            </span>
            <ArrowRight className="arrow-nudge arrow-nudge-right shrink-0 text-lg text-signal md:text-2xl md:text-current" />
          </span>
        </Link>
      </li>
    </ul>
  );
}
