import { stats } from "@/content/agency";

/**
 * "60K+ €" -> number 60 counted up from 0, suffix "K+ €" set in signal orange.
 * The server renders the final value, so crawlers, no-JS and reduced-motion
 * visitors always get the real figure; RevealScript counts the number up when the
 * panel appears.
 */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return <>{value}</>;
  return (
    <>
      <span data-count={match[1]} suppressHydrationWarning>
        {match[1]}
      </span>
      <span className="stat-suffix">{match[2]}</span>
    </>
  );
}

/**
 * The three verified figures as panels on the same hairline grid as the
 * "De ce să ne alegi" principles: discipline label on top, large counting numeral,
 * an orange meter that fills in step with the count, then the description.
 * On hover a panel turns ink, like the principles.
 */
export function StatsBand() {
  const total = String(stats.length).padStart(2, "0");
  return (
    <ul className="grid border-l border-t border-line md:grid-cols-3">
      {stats.map((stat, index) => (
        <li
          key={stat.label}
          className="stat group flex flex-col border-b border-r border-line bg-paper p-7 pb-9 md:min-h-[24rem] md:p-9 lg:p-10"
          suppressHydrationWarning
          data-reveal
          style={{ "--reveal-delay": index * 120 } as React.CSSProperties}
        >
          <p className="type-label flex items-center justify-between gap-4" aria-hidden="true">
            <span className="stat-tag flex items-center gap-2.5">
              <span className="h-2 w-2 bg-signal" />
              {stat.tag}
            </span>
            <span className="stat-index">
              {String(index + 1).padStart(2, "0")} / {total}
            </span>
          </p>
          <p className="stat-number type-number mt-12 whitespace-nowrap md:mt-auto md:pt-16" aria-label={stat.value}>
            <CountUp value={stat.value} />
          </p>
          <span aria-hidden="true" className="stat-meter mt-8 block h-px w-full">
            <span className="stat-meter-fill block h-full w-full" />
          </span>
          <p className="stat-label mt-6 max-w-[17rem]">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
}
