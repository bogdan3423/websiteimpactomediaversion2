import Image from "next/image";
import { team } from "@/content/agency";

/** Real team portraits. Staggered vertically on desktop for an editorial rhythm. */
export function TeamGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-x-[clamp(1rem,0.5rem+1.6vw,2rem)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, index) => (
        <li
          key={member.name}
          className={index === 1 ? "lg:mt-24" : index === 2 ? "lg:mt-12" : ""}
          suppressHydrationWarning data-reveal
          style={{ "--reveal-delay": index * 110 } as React.CSSProperties}
        >
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep" suppressHydrationWarning data-reveal="media">
              <Image
                src={member.image}
                alt={member.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                placeholder="blur"
                className="object-cover"
                style={{ objectPosition: member.position }}
              />
            </div>
            <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-current/15 pt-4">
              <Heading className="type-h4 md:text-xl">{member.name}</Heading>
              <span className="type-label text-right opacity-60">{String(index + 1).padStart(2, "0")}</span>
            </figcaption>
            <p className="mt-1 opacity-70">{member.role}</p>
          </figure>
        </li>
      ))}
    </ul>
  );
}
