import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";

/**
 * Decoder-style text scramble: characters churn through a glyph set and
 * lock in left-to-right. Returns the display string and a trigger.
 */
export function useScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setDisplay(text);
    return () => cancelAnimationFrame(raf.current);
  }, [text]);

  const scramble = useCallback(() => {
    if (reduced.current) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const dur = 90 + text.length * 34;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const locked = Math.floor(p * text.length);
      let out = text.slice(0, locked);
      for (let i = locked; i < text.length; i++) {
        const c = text[i];
        out += c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text]);

  return { display, scramble };
}
