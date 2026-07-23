import { useEffect, useRef, useState } from "react";

type WasmExports = { c: (n: number) => number };

let wasmPromise: Promise<WasmExports | null> | null = null;

/** Load the original collatz.wasm — the same binary the legacy Vue site shipped. */
function loadWasm(): Promise<WasmExports | null> {
  if (!wasmPromise) {
    wasmPromise = (async () => {
      try {
        const res = await fetch("/collatz.wasm");
        const bytes = await res.arrayBuffer();
        // 115 bytes, zero imports: the exact binary the legacy site served.
        const { instance } = await WebAssembly.instantiate(bytes, {});
        return instance.exports as unknown as WasmExports;
      } catch {
        return null;
      }
    })();
  }
  return wasmPromise;
}

type Entry = { n: number; steps: number; orbit: number[] };

/** The JS side only computes the orbit for drawing; the step count comes from the wasm. */
function orbitOf(n: number): number[] {
  const seq = [n];
  let v = n;
  while (v !== 1 && seq.length < 600) {
    v = v % 2 === 0 ? v / 2 : 3 * v + 1;
    seq.push(v);
  }
  return seq;
}

export function CollatzTerminal() {
  const [input, setInput] = useState("27");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wasmDead, setWasmDead] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    setError(null);
    const n = Number(input);
    if (!Number.isInteger(n) || n < 1 || n > 10_000_000) {
      setError("need an integer in [1, 10 000 000]");
      return;
    }
    const wasm = await loadWasm();
    let steps: number;
    if (wasm) {
      steps = wasm.c(n);
    } else {
      setWasmDead(true);
      steps = orbitOf(n).length - 1;
    }
    setEntries((prev) => [...prev.slice(-5), { n, steps, orbit: orbitOf(n) }]);
  };

  // seed one run so the panel never looks empty
  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    const canvas = chartRef.current;
    const last = entries[entries.length - 1];
    if (!canvas || !last) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const max = Math.log2(Math.max(...last.orbit));
    const pts = last.orbit.map((v, i) => [
      (i / Math.max(last.orbit.length - 1, 1)) * (w - 8) + 4,
      h - 6 - (Math.log2(v) / max) * (h - 14),
    ]);

    // animated trace
    let raf = 0;
    const t0 = performance.now();
    const dur = Math.min(300 + last.orbit.length * 8, 1600);
    const draw = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const upto = Math.max(2, Math.floor(p * pts.length));
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      pts.slice(0, upto).forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#ffb703";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      const [hx, hy] = pts[upto - 1];
      ctx.fillStyle = "#eae8e3";
      ctx.fillRect(hx - 1.5, hy - 1.5, 3, 3);
      if (p < 1) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [entries]);

  return (
    <div className="term" data-cursor="demo">
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title mono-label">
          collatz.wasm — {wasmDead ? "JS FALLBACK" : "115 B, COMPILED FROM C"}
        </span>
      </div>
      <div className="term-body">
        <div className="term-log" ref={logRef}>
          {entries.map((e, i) => (
            <p key={i}>
              <span className="term-prompt">$</span> c({e.n.toLocaleString()})
              <span className="term-out">
                {" "}
                → {e.steps} steps · peak{" "}
                {Math.max(...e.orbit).toLocaleString()}
              </span>
            </p>
          ))}
          {error && <p className="term-err">! {error}</p>}
        </div>
        <canvas ref={chartRef} className="term-chart" aria-label="Collatz orbit chart" />
        <form
          className="term-input"
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
        >
          <span className="term-prompt">n =</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode="numeric"
            aria-label="Collatz input number"
            spellCheck={false}
          />
          <button type="submit" data-cursor="link">
            RUN ⏎
          </button>
        </form>
      </div>
    </div>
  );
}
