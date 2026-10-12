type Props = { index?: string; children: React.ReactNode; tone?: "light" | "dark"; className?: string };

/** Small section label: optional index in the signal colour, then a short rule and the name. */
export function Eyebrow({ index, children, tone = "light", className = "" }: Props) {
  const muted = tone === "dark" ? "text-ash" : "text-graphite";
  const rule = tone === "dark" ? "bg-line-dark" : "bg-line";
  return (
    <p className={`type-label flex items-center gap-3 ${muted} ${className}`}>
      {index ? <span className="text-signal">{index}</span> : null}
      {index ? <span aria-hidden="true" className={`h-px w-8 ${rule}`} /> : null}
      <span>{children}</span>
    </p>
  );
}
