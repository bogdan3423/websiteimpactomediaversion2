import { RotatingWord } from "@/components/sections/RotatingWord";

const lead = "Facem marketing care atrage atenția și o transformă";

function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="headline-mask">
      <span className="headline-word" style={{ "--i": i } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/**
 * Hero headline. Each word rises from behind its own mask with a short
 * stagger (CSS only, runs before hydration). The closing phrase "în …" is the
 * accent: inline on desktop, a full-bleed ink band on phones that sweeps in
 * before its words rise. The last word rotates. Screen readers get one sentence.
 */
export function HeroHeadline() {
  const words = lead.split(" ");
  return (
    <h1 id="hero-title" className="type-display hero-headline mx-auto max-w-none text-left md:max-w-[17ch] md:text-center">
      <span className="sr-only">Facem marketing care atrage atenția și o transformă în acțiune, creștere și rezultate.</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <Word i={index}>{word}</Word>{" "}
          </span>
        ))}
        <span className="headline-accent">
          <Word i={words.length}>în</Word>{" "}
          <Word i={words.length + 1}>
            <RotatingWord />
          </Word>
        </span>
      </span>
    </h1>
  );
}
