import { stats } from "@/content/agency";

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
          <dd className="type-number order-1 whitespace-nowrap">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
