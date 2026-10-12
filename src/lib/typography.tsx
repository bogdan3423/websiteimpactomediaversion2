import { Fragment, type ReactNode } from "react";

/**
 * Keeps hyphenated Romanian words ("website-uri", "într-o") on one line so
 * large headings never break as "website-" / "uri".
 */
export function keepHyphenated(text: ReactNode): ReactNode {
  if (typeof text !== "string" || !text.includes("-")) return text;
  return text.split(/(\S+-\S+)/g).map((part, index) =>
    /\S+-\S+/.test(part) ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
