import { useEffect, useRef, useState } from "react";

/**
 * Reynolds flocking, ported from Boid.ts on the legacy Vue site — same
 * three rules, same perception radii, same force weights — then given a
 * uniform spatial hash so ~4× the flock still runs at 60fps. The cursor
 * is a predator; hold the pointer down to become food instead.
 */

type Boid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const PERCEPTION = { align: 25, separate: 24, cohere: 50 };
const MAX_SPEED = 2.6;
const MAX_FORCE = 0.18;
const CELL = 50; // == max perception radius

export function BoidsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weightsRef = useRef({ align: 1.5, cohere: 1.0, separate: 3.0 });
  const [weights, setWeights] = useState(weightsRef.current);

  useEffect(() => {
    weightsRef.current = weights;
  }, [weights]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let boids: Boid[] = [];
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999, in: false, attract: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = w < 640 ? 90 : 220;
      while (boids.length < target) {
        const a = Math.random() * Math.PI * 2;
        boids.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(a) * MAX_SPEED,
          vy: Math.sin(a) * MAX_SPEED,
        });
      }
      boids.length = target;
      ctx.fillStyle = "#0a0a0e";
      ctx.fillRect(0, 0, w, h);
    };

    const step = () => {
      // uniform grid rebuild — O(n), keys are packed cell coords
      const cols = Math.max(1, Math.ceil(w / CELL));
      const grid = new Map<number, number[]>();
      boids.forEach((b, i) => {
        const key = ((b.x / CELL) | 0) + ((b.y / CELL) | 0) * cols;
        const cell = grid.get(key);
        if (cell) cell.push(i);
        else grid.set(key, [i]);
      });

      const W = weightsRef.current;
      const next: Boid[] = new Array(boids.length);

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let aX = 0, aY = 0, aN = 0; // alignment
        let cX = 0, cY = 0, cN = 0; // cohesion
        let sX = 0, sY = 0, sN = 0; // separation

        const gx = (b.x / CELL) | 0;
        const gy = (b.y / CELL) | 0;
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const cell = grid.get(gx + ox + (gy + oy) * cols);
            if (!cell) continue;
            for (const j of cell) {
              if (j === i) continue;
              const o = boids[j];
              const dx = b.x - o.x;
              const dy = b.y - o.y;
              const d = Math.hypot(dx, dy);
              if (d < PERCEPTION.align) {
                aX += o.vx;
                aY += o.vy;
                aN++;
              }
              if (d < PERCEPTION.cohere) {
                cX += o.x;
                cY += o.y;
                cN++;
              }
              if (d < PERCEPTION.separate && d > 0) {
                sX += dx / (d * d);
                sY += dy / (d * d);
                sN++;
              }
            }
          }
        }

        // steer = desired(setMag maxSpeed) - velocity, limited — as in the original
        let fx = 0;
        let fy = 0;
        const steer = (dx: number, dy: number, weight: number) => {
          const m = Math.hypot(dx, dy);
          if (m === 0) return;
          let x = (dx / m) * MAX_SPEED - b.vx;
          let y = (dy / m) * MAX_SPEED - b.vy;
          const f = Math.hypot(x, y);
          if (f > MAX_FORCE) {
            x = (x / f) * MAX_FORCE;
            y = (y / f) * MAX_FORCE;
          }
          fx += x * weight;
          fy += y * weight;
        };
        if (aN) steer(aX / aN, aY / aN, W.align);
        if (cN) steer(cX / cN - b.x, cY / cN - b.y, W.cohere);
        if (sN) steer(sX / sN, sY / sN, W.separate);

        // the cursor: predator by default, feeder while pressed
        if (pointer.in) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 0) {
            const s = ((130 - d) / 130) * 0.9 * (pointer.attract ? -0.5 : 1);
            fx += (dx / d) * s;
            fy += (dy / d) * s;
          }
        }

        let vx = b.vx + fx;
        let vy = b.vy + fy;
        const sp = Math.hypot(vx, vy);
        if (sp > MAX_SPEED) {
          vx = (vx / sp) * MAX_SPEED;
          vy = (vy / sp) * MAX_SPEED;
        }
        let x = b.x + vx;
        let y = b.y + vy;
        if (x > w) x = 0;
        else if (x < 0) x = w;
        if (y > h) y = 0;
        else if (y < 0) y = h;
        next[i] = { x, y, vx, vy };
      }
      boids = next;
    };

    const draw = () => {
      // translucent wash = motion trails
      ctx.fillStyle = "rgba(10, 10, 14, 0.16)";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const a = Math.atan2(b.vy, b.vx);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(-3, 2.6);
        ctx.lineTo(-3, -2.6);
        ctx.closePath();
        ctx.fillStyle = i % 17 === 0 ? "#ffb703" : "rgba(234,232,227,0.72)";
        ctx.fill();
        ctx.restore();
      }
    };

    const loop = () => {
      if (!running) return;
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) {
      // static frame
      step();
      draw();
    }

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.in =
        pointer.x >= 0 && pointer.y >= 0 && pointer.x <= w && pointer.y <= h;
    };
    const onLeave = () => (pointer.in = false);
    const onDown = () => (pointer.attract = true);
    const onUp = () => (pointer.attract = false);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const slider = (key: "align" | "cohere" | "separate", label: string) => (
    <label className="demo-slider mono-label">
      {label}
      <input
        type="range"
        min={0}
        max={3}
        step={0.1}
        value={weights[key]}
        onChange={(e) =>
          setWeights((s) => ({ ...s, [key]: Number(e.target.value) }))
        }
      />
      <span>{weights[key].toFixed(1)}</span>
    </label>
  );

  return (
    <div className="boids" data-cursor="demo">
      <canvas ref={canvasRef} className="boids-canvas" aria-label="Boids flocking simulation" />
      <div className="demo-controls">
        {slider("separate", "SEPARATION")}
        {slider("align", "ALIGNMENT")}
        {slider("cohere", "COHESION")}
      </div>
    </div>
  );
}
