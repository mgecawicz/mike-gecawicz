import { useEffect, useRef, useState } from "react";
import { ParticleField } from "../gl/ParticleField";
import { site } from "../content";
import { Reveal } from "./Reveal";

/**
 * The hero. 40k GPU particles assemble the name, flee the cursor,
 * detonate on click, and melt into turbulence as you scroll away.
 * Falls back to plain (still huge) type without WebGL2 or with
 * reduced motion.
 */
export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canvas = canvasRef.current;
    if (reduced || !canvas) {
      setFallback(true);
      return;
    }

    let field: ParticleField | null = null;
    let disposed = false;
    let io: IntersectionObserver | null = null;

    const onPointer = (e: PointerEvent) =>
      field?.setPointer(e.clientX, e.clientY, true);
    const onLeave = () => field?.setPointer(-9999, -9999, false);
    const onClick = (e: MouseEvent) => field?.pulseAt(e.clientX, e.clientY);
    const onScroll = () => {
      const v = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      field?.setScatter(v);
    };
    const onDetonate = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      field?.pulseAt(window.innerWidth / 2, window.innerHeight / 2);
    };
    const onVis = () => {
      if (document.hidden) field?.stop();
      else field?.start();
    };

    (async () => {
      const f = new ParticleField(canvas, {
        lines: ["MIKE", "GECAWICZ"],
        onStats: (s) =>
          window.dispatchEvent(new CustomEvent("mg:stats", { detail: s })),
      });
      const ok = await f.init();
      if (!ok || disposed) {
        if (!ok) setFallback(true);
        f.destroy();
        return;
      }
      field = f;
      f.start();
      onScroll();

      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) field?.start();
          else field?.stop();
        },
        { threshold: 0.02 },
      );
      io.observe(canvas);

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onClick);
      window.addEventListener("blur", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("mg:detonate", onDetonate);
      document.addEventListener("visibilitychange", onVis);
    })();

    return () => {
      disposed = true;
      io?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mg:detonate", onDetonate);
      document.removeEventListener("visibilitychange", onVis);
      field?.destroy();
      field = null;
    };
  }, []);

  return (
    <section className="hero" id="top" aria-label="Intro">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      {fallback && (
        <div className="hero-fallback" aria-hidden="true">
          <span>MIKE</span>
          <span>GECAWICZ</span>
        </div>
      )}
      <h1 className="sr-only">{site.name}, {site.role}</h1>

      <div className="hero-meta">
        <Reveal delay={400} from="fade">
          <p className="hero-role">
            {site.role}
            <br />
            <span className="hero-loc">{site.location}</span>
          </p>
        </Reveal>
        <Reveal delay={520} from="fade">
          <p className="hero-hint mono-label">
            move · click · scroll · <kbd>⌘K</kbd> for commands
          </p>
        </Reveal>
      </div>

      <div className="hero-scroll mono-label" aria-hidden="true">
        <span>SCROLL</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
