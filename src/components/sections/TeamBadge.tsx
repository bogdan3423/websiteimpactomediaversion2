import Image from "next/image";
import Link from "next/link";
import { team } from "@/content/agency";

/**
 * Real team portraits as a compact badge next to the hero CTA
 * (the "avatar list" of the referenced hero pattern, with actual people).
 */
export function TeamBadge() {
  return (
    <Link href="/despre-noi" className="group inline-flex items-center gap-4" aria-label="Cunoaște echipa ImpactoMedia">
      <span className="flex -space-x-2.5">
        {team.map((member) => (
          <span key={member.name} className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-paper md:h-11 md:w-11">
            <Image
              src={member.image}
              alt={member.alt}
              fill
              sizes="44px"
              className="object-cover"
              style={{ objectPosition: member.position }}
            />
          </span>
        ))}
      </span>
      <span className="text-left">
        <span className="block text-[0.9375rem] font-medium">Echipa ImpactoMedia</span>
        <span className="link-line block text-sm text-graphite">Cunoaște oamenii din spatele proiectelor</span>
      </span>
    </Link>
  );
}
