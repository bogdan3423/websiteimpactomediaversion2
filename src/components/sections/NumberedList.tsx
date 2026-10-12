type Item = { title: string; text: string };

type Props = {
  items: Item[];
  columns?: 2 | 3 | 4;
  tone?: "light" | "dark";
  headingLevel?: "h3" | "h4";
};

const columnClass = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4" };

/** Numbered steps/principles separated by top hairlines. Used for processes and principles. */
export function NumberedList({ items, columns = 4, tone = "light", headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const line = tone === "dark" ? "border-line-dark" : "border-line";
  const muted = tone === "dark" ? "text-ash" : "text-graphite";
  return (
    <ol className={`grid gap-x-[clamp(1rem,0.5rem+1.6vw,2rem)] gap-y-10 ${columnClass[columns]}`}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className={`border-t ${line} pt-5`}
          suppressHydrationWarning data-reveal
          style={{ "--reveal-delay": index * 90 } as React.CSSProperties}
        >
          <span className="type-label text-signal">{String(index + 1).padStart(2, "0")}</span>
          <Heading className="type-h3 mt-8">{item.title}</Heading>
          <p className={`mt-3 max-w-sm ${muted}`}>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
