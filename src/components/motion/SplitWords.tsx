import { Fragment, type ReactNode } from "react";
import { keepHyphenated } from "@/lib/typography";

/**
 * Splits a heading into masked words that rise one after another, using the
 * same motion as the homepage hero (.headline-mask / .headline-word in
 * globals.css).
 *
 * - Inside an element with data-reveal="words" the animation waits until the
 *   heading scrolls into view (RevealScript starts it).
 * - Anywhere else it plays on page load (inner-page heroes).
 *
 * Words are plain inline spans, so the heading text stays a single readable
 * string for crawlers and screen readers. Long headings get a tighter stagger
 * so the whole line never takes much longer than a short one.
 */
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  const step = Math.min(1, 12 / words.length);
  return words.map((word, index) => (
    <Fragment key={index}>
      <span className="headline-mask">
        <span className="headline-word kinetic-word" style={{ "--i": +(start + index * step).toFixed(2) } as React.CSSProperties}>
          {word}
        </span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
}

/** Word animation for plain-string titles; anything else renders as before. */
export function animatedTitle(title: ReactNode): ReactNode {
  return typeof title === "string" ? <SplitWords text={title} /> : keepHyphenated(title);
}

/** Delay (ms) for content that should follow a heading's words. */
export function afterWords(title: ReactNode, base = 180): number {
  const count = typeof title === "string" ? title.split(/\s+/).filter(Boolean).length : 6;
  return Math.round(base + Math.min(count, 12) * 60);
}
