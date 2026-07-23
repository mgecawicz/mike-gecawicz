import { useEffect, useState } from "react";

/**
 * A sub-second boot sequence: a counter races 0→100 with eased jumps
 * while the monogram flickers, then the shutter lifts. Shown once per
 * session; skipped entirely under reduced motion.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [skip] = useState(
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("mg:booted") === "1",
  );

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }
    let v = 0;
    let alive = true;
    const step = () => {
      if (!alive) return;
      v = Math.min(100, v + Math.ceil(Math.random() * 14) + 4);
      setPct(v);
      if (v < 100) {
        setTimeout(step, 40 + Math.random() * 70);
      } else {
        sessionStorage.setItem("mg:booted", "1");
        setTimeout(() => {
          setLeaving(true);
          setTimeout(onDone, 620);
        }, 180);
      }
    };
    const t = setTimeout(step, 120);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [skip, onDone]);

  if (skip) return null;
  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} aria-hidden="true">
      <div className="preloader-inner">
        <span className="preloader-mark">MG</span>
        <span className="preloader-pct">{String(pct).padStart(3, "0")}</span>
      </div>
      <div className="preloader-bar">
        <div className="preloader-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
