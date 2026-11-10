import type { TocItem } from "@/lib/blog/markdown";

/** Table of contents: sticky rail on desktop, collapsible block on phones. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  const list = (
    <ol className="space-y-3 text-[0.9375rem] leading-snug">
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="toc-link block text-graphite transition-colors duration-200 hover:text-ink">
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <details className="toc-mobile border-y border-line lg:hidden">
        <summary className="type-label flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-ink">
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
            Cuprins
          </span>
          <span aria-hidden="true" className="toc-plus text-lg leading-none">+</span>
        </summary>
        <nav aria-label="Cuprins" className="pb-6 pt-2">
          {list}
        </nav>
      </details>
      <nav aria-label="Cuprins articol" className="hidden lg:block">
        <p className="type-label flex items-center gap-2.5 border-b border-line pb-4 text-ink">
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
          Cuprins
        </p>
        <div className="pt-5">{list}</div>
      </nav>
    </>
  );
}
