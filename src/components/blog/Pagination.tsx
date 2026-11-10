import Link from "next/link";
import { TextLink } from "@/components/ui/ButtonLink";

const href = (base: string, page: number) => (page === 1 ? base : `${base}/pagina/${page}`);

/** Crawlable pagination: real links to every page, newer on the left, older on the right. */
export function Pagination({ base, page, pages }: { base: string; page: number; pages: number }) {
  if (pages < 2) return null;
  return (
    <nav aria-label="Paginare" className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
      <div className="min-w-32">{page > 1 ? <TextLink href={href(base, page - 1)}>Articole mai noi</TextLink> : null}</div>
      <ol className="type-label flex items-center gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <Link
              href={href(base, n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={`Pagina ${n}`}
              className="flex h-10 min-w-10 items-center justify-center border border-transparent px-2 text-graphite transition-colors hover:border-line hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink"
            >
              {n}
            </Link>
          </li>
        ))}
      </ol>
      <div className="flex min-w-32 justify-end">
        {page < pages ? <TextLink href={href(base, page + 1)}>Articole mai vechi</TextLink> : null}
      </div>
    </nav>
  );
}
