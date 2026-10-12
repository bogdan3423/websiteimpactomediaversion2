import { stats } from "@/content/agency";

/**
 * "60K+ €" -> number 60 counted up from 0, suffix "K+ €" kept as is. The server
 * renders the final value, so crawlers, no-JS and reduced-motion visitors always
 * get the real figure; RevealScript counts the number up when the block appears.
 */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return <>{value}</>;
  return (
    <>
      <span data-count={match[1]} suppressHydrationWarning>
        {match[1]}
      </span>
      {match[2]}
    </>
  );
}

/** The three verified figures from the original site, set as large numerals between hairlines. */
export function StatsBand({ tone = "light" }: { tone?: "light" | "dark" }) {
  const line = tone === "dark" ? "border-line-dark" : "border-line";
  const muted = tone === "dark" ? "text-ash" : "text-graphite";
  return (
    <dl className={`grid border-t ${line} md:grid-cols-3`}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex flex-col justify-between gap-4 border-b ${line} py-8 md:border-b-0 md:gap-10 md:py-10 md:pr-8 ${
            index > 0 ? `md:border-l md:pl-8` : ""
          }`}
          suppressHydrationWarning data-reveal
          style={{ "--reveal-delay": index * 90 } as React.CSSProperties}
        >
          <dt className={`order-2 max-w-[16rem] ${muted}`}>{stat.label}</dt>
          <dd className="type-number order-1 whitespace-nowrap" aria-label={stat.value}>
            <CountUp value={stat.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
