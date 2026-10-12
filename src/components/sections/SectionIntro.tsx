import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { afterWords, animatedTitle } from "@/components/motion/SplitWords";

type Props = {
  index?: string;
  label: string;
  title: ReactNode;
  text?: ReactNode;
  tone?: "light" | "dark";
  as?: "h2" | "h3";
  id?: string;
};

/** Asymmetric section opener: label in the left rail, heading and copy on the right. */
export function SectionIntro({ index, label, title, text, tone = "light", as: Heading = "h2", id }: Props) {
  return (
    <div className="grid-site gap-y-6">
      <div className="col-span-4 md:col-span-8 lg:col-span-3" suppressHydrationWarning data-reveal="fade">
        <Eyebrow index={index} tone={tone}>
          {label}
        </Eyebrow>
      </div>
      <div className="col-span-4 md:col-span-7 lg:col-span-8 lg:col-start-5">
        <Heading id={id} className="type-h2" suppressHydrationWarning data-reveal="words">
          {animatedTitle(title)}
        </Heading>
        {text ? (
          <div
            className={`type-lead mt-6 max-w-2xl ${tone === "dark" ? "text-ash" : "text-graphite"}`}
            suppressHydrationWarning
            data-reveal
            style={{ "--reveal-delay": afterWords(title) } as React.CSSProperties}
          >
            {text}
          </div>
        ) : null}
      </div>
    </div>
  );
}
