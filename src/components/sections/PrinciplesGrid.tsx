type Item = { title: string; text: string };

/**
 * Small geometric marks in the logo's language (filled + outlined squares, square
 * caps, one signal accent). Paths use pathLength=1 so CSS can draw them in.
 */
function Mark({ index }: { index: number }) {
  const common = { pathLength: 1, className: "principle-stroke" };
  return (
    <svg viewBox="0 0 64 64" className="principle-mark h-14 w-14 md:h-16 md:w-16" aria-hidden="true" fill="none">
      {index === 0 ? (
        // Three disciplines overlapping into one system.
        <>
          <rect x="6" y="26" width="24" height="24" {...common} />
          <rect x="20" y="16" width="24" height="24" className="principle-fill" />
          <rect x="34" y="6" width="24" height="24" {...common} />
        </>
      ) : index === 1 ? (
        // Plan first (filled), then the route to execution (outlined).
        <>
          <rect x="6" y="24" width="16" height="16" className="principle-fill" />
          <path d="M26 32H50M43 25l7 7-7 7" {...common} />
          <rect x="52" y="22" width="6" height="20" {...common} />
        </>
      ) : (
        // Clear steps that build on each other.
        <>
          <rect x="6" y="38" width="14" height="20" {...common} />
          <rect x="25" y="24" width="14" height="34" {...common} />
          <rect x="44" y="8" width="14" height="50" className="principle-fill" />
        </>
      )}
    </svg>
  );
}

/**
 * Homepage "De ce să ne alegi": three tall panels on a hairline grid. Each panel
 * pairs an outlined numeral with a geometric mark, then the principle. On reveal the
 * marks draw themselves; on hover a panel turns ink, the numeral fills in signal
 * orange. The numerals paint in with an orange sweep that cools to the outline,
 * in step with the marks. Flat and sharp, no cards or shadows, matching the rest of the site.
 */
export function PrinciplesGrid({ items }: { items: Item[] }) {
  return (
    <ol className="grid border-l border-t border-line md:grid-cols-3">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="principle group relative flex flex-col border-b border-r border-line bg-paper p-7 pb-9 md:min-h-[28rem] md:p-9 lg:p-10"
          suppressHydrationWarning
          data-reveal
          style={{ "--reveal-delay": index * 120 } as React.CSSProperties}
        >
          <div className="flex items-start justify-between gap-6">
            <span className="principle-number type-number" data-n={String(index + 1).padStart(2, "0")} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Mark index={index} />
          </div>
          <div className="mt-14 md:mt-20">
            <span aria-hidden="true" className="principle-rule mb-6 block h-px w-10" />
            <h3 className="principle-title max-w-[16ch]">{item.title}</h3>
            <p className="principle-text mt-5 max-w-sm">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
