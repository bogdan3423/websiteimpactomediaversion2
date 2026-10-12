"use client";

import { useEffect, useState } from "react";

/**
 * The last headline word swaps through a short list: the current word slides
 * up and out while the next one rises in. An invisible copy of the longest
 * word reserves the width, so the centred headline never jumps.
 * Static for prefers-reduced-motion. Pure CSS keyframes, no animation library.
 */
const words = ["acțiune.", "creștere.", "rezultate."];
const longest = words.reduce((a, b) => (b.length > a.length ? b : a));

export function RotatingWord() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // first swap waits for the headline entrance to finish
    const interval = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(interval);
  }, []);

  const current = words[tick % words.length];
  const previous = tick > 0 ? words[(tick - 1) % words.length] : null;

  return (
    <span className="rotating-word" aria-hidden="true">
      <span className="rotating-word-sizer">{longest}</span>
      {previous ? (
        <span key={`out-${tick}`} className="rotating-word-item rotating-word-out">
          {previous}
        </span>
      ) : null}
      <span key={`in-${tick}`} className={`rotating-word-item ${tick > 0 ? "rotating-word-in" : ""}`}>
        {current}
      </span>
    </span>
  );
}
