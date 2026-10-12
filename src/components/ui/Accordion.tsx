import { PlusIcon } from "@/components/ui/icons";

type Item = { question: string; answer: string };

/**
 * FAQ list built on native <details>/<summary>: keyboard and screen-reader
 * support for free, works without JavaScript, answers stay in the HTML.
 * Height animation is progressive (::details-content + interpolate-size).
 */
export function Accordion({ items, name, tone = "light" }: { items: Item[]; name: string; tone?: "light" | "dark" }) {
  const line = tone === "dark" ? "border-line-dark" : "border-line";
  const muted = tone === "dark" ? "text-ash" : "text-graphite";
  const openIcon = tone === "dark" ? "group-open:bg-paper group-open:text-ink" : "group-open:bg-ink group-open:text-paper";

  return (
    <div className={`border-t ${line}`}>
      {items.map((item) => (
        <details key={item.question} name={name} className={`faq-item group border-b ${line}`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="type-h4 md:text-xl">{item.question}</h3>
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border ${line} transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-current group-open:rotate-45 ${openIcon}`}
            >
              <PlusIcon className="text-sm" />
            </span>
          </summary>
          <p className={`max-w-2xl pb-7 pr-12 ${muted}`}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
