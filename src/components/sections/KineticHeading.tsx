type Props = {
  id?: string;
  /** Words that rise first, in ink. */
  text: string;
  /** Closing phrase, set in the signal colour. */
  accent: string;
  className?: string;
};

function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="headline-mask">
      <span className="headline-word kinetic-word" style={{ "--i": i } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/**
 * Section heading that uses the hero's motion language, triggered on scroll:
 * words rise from their masks with a stagger, the accent phrase follows
 *. Content is fully visible
 * without JavaScript and static for reduced-motion users.
 */
export function KineticHeading({ id, text, accent, className = "" }: Props) {
  const words = text.split(" ");
  const accentWords = accent.split(" ");
  return (
    <h2 id={id} className={`kinetic-heading ${className}`} suppressHydrationWarning data-reveal="words">
      <span className="sr-only">{`${text} ${accent}`}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`t${index}`}>
            <Word i={index}>{word}</Word>{" "}
          </span>
        ))}
        <span className="kinetic-accent">
          {accentWords.map((word, index) => (
            <span key={`a${index}`}>
              <Word i={words.length + index}>{word}</Word>
              {index < accentWords.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      </span>
    </h2>
  );
}
