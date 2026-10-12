type Item = { title: string; text: string };

type Props = {
  items: Item[];
  columns?: 2 | 3 | 4;
  tone?: "light" | "dark";
  headingLevel?: "h3" | "h4";
};

const columnClass = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4" };

/**
 * Numbered steps as panels on a hairline grid, the lighter sibling of the homepage
 * principles: an outlined numeral that paints in with an orange sweep, a short orange
 * rule that draws in, then the step. No illustrations, so long processes stay calm.
 * Hover darkens the panel slightly (light tone) or lifts it (dark tone).
 */
export function NumberedList({ items, columns = 4, tone = "light", headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const line = tone === "dark" ? "border-line-dark" : "border-line";
  return (
    <ol className={`numbered-grid grid border-l border-t ${line} ${columnClass[columns]}`} data-tone={tone}>
      {items.map((item, index) => {
        const n = String(index + 1).padStart(2, "0");
        return (
          <li
            key={item.title}
            className={`numbered flex flex-col border-b border-r ${line} p-6 pb-8 md:p-8 md:pb-10`}
            suppressHydrationWarning
            data-reveal
            style={{ "--reveal-delay": index * 100 } as React.CSSProperties}
          >
            <span className="numbered-number" data-n={n} aria-hidden="true">
              {n}
            </span>
            <span aria-hidden="true" className="numbered-rule mt-10 block h-px w-8 md:mt-14" />
            <Heading className="type-h3 mt-5">{item.title}</Heading>
            <p className="numbered-text mt-3 max-w-sm">{item.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
