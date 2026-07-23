import { useRef, useState, useEffect } from "react";
import { projects, gallery } from "../content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function VideoLoop({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className="strip-item strip-video">
      <video ref={ref} src={src} muted loop playsInline preload="metadata" />
      <figcaption className="mono-label">{label} · BLENDER</figcaption>
    </figure>
  );
}

export function Work() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  // drag-to-scroll for the gallery strip
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      setDrag(true);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = () => {
      down = false;
      setDrag(false);
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <section className="section work" id="work">
      <SectionHeading
        index="04"
        title="Selected Work"
        note="Patents, packages, prints, and products — a decade of shipping in every direction."
      />

      <ul className="project-grid">
        {projects.map((p, i) => {
          const inner = (
            <>
              <div className="project-top">
                <span className="mono-label project-kind">{p.kind}</span>
                <span className="project-arrow" aria-hidden="true">
                  {p.href ? "↗" : "·"}
                </span>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-blurb">{p.blurb}</p>
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span className="mono-label project-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          );
          return (
            <Reveal as="li" key={p.title} delay={(i % 2) * 80} className="project-card-wrap">
              {p.href ? (
                <a
                  className="project-card"
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="card"
                >
                  {inner}
                </a>
              ) : (
                <div className="project-card" data-cursor="card">
                  {inner}
                </div>
              )}
            </Reveal>
          );
        })}
        <Reveal as="li" delay={160} className="project-card-wrap">
          <a
            className="project-card project-card-ghost"
            href="https://github.com/mgecawicz?tab=repositories"
            target="_blank"
            rel="noreferrer"
            data-cursor="card"
          >
            <span className="ghost-plus" aria-hidden="true">
              +
            </span>
            <span className="mono-label">EVERYTHING ELSE ON GITHUB</span>
          </a>
        </Reveal>
      </ul>

      <Reveal from="fade">
        <div className="strip-head">
          <h3 className="strip-title">Rendered worlds</h3>
          <p className="strip-note mono-label">
            BLENDER / PHYSICS SIMS / DRAG TO EXPLORE →
          </p>
        </div>
      </Reveal>
      <div
        ref={stripRef}
        className={`strip ${drag ? "is-dragging" : ""}`}
        data-cursor="drag"
      >
        {gallery.loops.map((v) => (
          <VideoLoop key={v.src} src={v.src} label={v.label} />
        ))}
        {gallery.stills.map((s) => (
          <figure className="strip-item" key={s.src}>
            <img src={s.src} alt={s.alt} loading="lazy" draggable={false} />
          </figure>
        ))}
      </div>
    </section>
  );
}
