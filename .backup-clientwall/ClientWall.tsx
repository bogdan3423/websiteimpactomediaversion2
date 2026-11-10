import Image from "next/image";
import { clients } from "@/content/clients";

/** Height per logo shape so very different proportions read at a similar visual weight. */
const sizes = {
  wide: "max-h-11 max-w-[90%] md:max-h-12",
  medium: "max-h-14 max-w-[78%] md:max-h-16",
  square: "max-h-20 max-w-[62%] md:max-h-[5.5rem]",
};

/**
 * Real client logos in their own colours, set openly on the page (no tiles),
 * aligned on an even grid; an incomplete last row is centred. They rise in on scroll
 * and grow slightly on hover.
 */
export function ClientWall() {
  return (
    <ul className="-mx-3 flex flex-wrap justify-center gap-y-6 md:gap-y-14 lg:-mx-5">
      {clients.map((client, index) => (
        <li
          key={client.name}
          className="group flex h-24 basis-1/2 items-center justify-center px-3 sm:basis-1/3 md:h-28 lg:basis-1/6 lg:px-5"
          suppressHydrationWarning data-reveal
          style={{ "--reveal-delay": (index % 6) * 70 + Math.floor(index / 6) * 120 } as React.CSSProperties}
        >
          <Image
            src={client.logo}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 46vw"
            className={`h-auto w-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] ${sizes[client.shape]}`}
          />
        </li>
      ))}
    </ul>
  );
}
