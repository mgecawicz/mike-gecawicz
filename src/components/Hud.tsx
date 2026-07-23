import { useEffect, useState } from "react";
import { site, sections } from "../content";

/**
 * Fixed instrument frame: monogram, local time + coordinates, live
 * renderer stats (dispatched by the particle field), scroll depth and
 * current section. All Departure Mono, all tiny.
 */
export function Hud() {
  const [time, setTime] = useState("");
  const [stats, setStats] = useState({ fps: 0, count: 0 });
  const [scroll, setScroll] = useState(0);
  const [section, setSection] = useState(sections[0]);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onStats = (e: Event) =>
      setStats((e as CustomEvent<{ fps: number; count: number }>).detail);
    window.addEventListener("mg:stats", onStats);
    return () => window.removeEventListener("mg:stats", onStats);
  }, []);

  useEffect(() => {
    let raf = 0;
    let queued = false;
    const measure = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const s = sections.find((x) => x.id === e.target.id);
            if (s) setSection(s);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <div className="hud" aria-hidden="true">
      <div className="hud-corner hud-tl">
        <span className="hud-mark">MG</span>
        <span className="hud-dim">v3.0</span>
      </div>
      <div className="hud-corner hud-tr">
        <span>{time}</span>
        <span className="hud-dim">{site.coords}</span>
      </div>
      <div className="hud-corner hud-bl">
        {stats.fps > 0 ? (
          <span>
            {stats.fps} FPS · {stats.count.toLocaleString()} PTS
          </span>
        ) : (
          <span className="hud-dim">RENDERER IDLE</span>
        )}
      </div>
      <div className="hud-corner hud-br">
        <span className="hud-dim">
          {section.index} / {section.label.toUpperCase()}
        </span>
        <span>{String(scroll).padStart(3, "0")}%</span>
      </div>
    </div>
  );
}
