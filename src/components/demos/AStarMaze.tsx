import { useEffect, useRef, useState } from "react";

/**
 * The legacy site's A* maze, rebuilt as a live visualization: a
 * recursive-backtracking generator carves the maze on screen, then A*
 * (Manhattan heuristic, binary-heap open set) hunts the exit — frontier
 * in cyan, visited in smoke, final path burned in amber.
 */

const COLS = 41; // odd
const ROWS = 25; // odd
const WALL = 1;
const OPEN = 0;

type Cell = readonly [number, number];

function carveMaze(): Uint8Array {
  const g = new Uint8Array(COLS * ROWS).fill(WALL);
  const at = (x: number, y: number) => y * COLS + x;
  const stack: Cell[] = [[1, 1]];
  g[at(1, 1)] = OPEN;
  const dirs: Cell[] = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2],
  ];
  const order: Cell[][] = [];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options = dirs
      .map(([dx, dy]) => [x + dx, y + dy] as const)
      .filter(
        ([nx, ny]) =>
          nx > 0 && ny > 0 && nx < COLS && ny < ROWS && g[at(nx, ny)] === WALL,
      );
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const [nx, ny] = options[(Math.random() * options.length) | 0];
    g[at(nx, ny)] = OPEN;
    g[at((x + nx) / 2, (y + ny) / 2)] = OPEN;
    order.push([
      [(x + nx) / 2, (y + ny) / 2],
      [nx, ny],
    ]);
    stack.push([nx, ny]);
  }
  // stash carve order on the grid object for animation
  (g as Uint8Array & { order?: Cell[][] }).order = order;
  return g;
}

/** A* with a tiny binary heap; returns visit order + parent map + path. */
function solve(grid: Uint8Array) {
  const at = (x: number, y: number) => y * COLS + x;
  const start = at(1, 1);
  const goal = at(COLS - 2, ROWS - 2);
  const hx = (i: number) =>
    Math.abs((i % COLS) - (COLS - 2)) + Math.abs(((i / COLS) | 0) - (ROWS - 2));

  const gScore = new Float64Array(COLS * ROWS).fill(Infinity);
  const parent = new Int32Array(COLS * ROWS).fill(-1);
  const inHeap = new Uint8Array(COLS * ROWS);
  gScore[start] = 0;

  const heap: number[] = [start];
  const f = new Float64Array(COLS * ROWS).fill(Infinity);
  f[start] = hx(start);
  const less = (a: number, b: number) => f[heap[a]] < f[heap[b]];
  const swap = (a: number, b: number) => {
    [heap[a], heap[b]] = [heap[b], heap[a]];
  };
  const push = (i: number) => {
    heap.push(i);
    inHeap[i] = 1;
    let c = heap.length - 1;
    while (c > 0) {
      const p = (c - 1) >> 1;
      if (less(c, p)) {
        swap(c, p);
        c = p;
      } else break;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop()!;
    inHeap[top] = 0;
    if (heap.length) {
      heap[0] = last;
      let p = 0;
      for (;;) {
        const l = p * 2 + 1;
        const r = l + 1;
        let m = p;
        if (l < heap.length && less(l, m)) m = l;
        if (r < heap.length && less(r, m)) m = r;
        if (m === p) break;
        swap(m, p);
        p = m;
      }
    }
    return top;
  };

  const visits: { cell: number; frontier: number[] }[] = [];
  while (heap.length) {
    const cur = pop();
    visits.push({ cell: cur, frontier: [...heap] });
    if (cur === goal) break;
    const cx = cur % COLS;
    const cy = (cur / COLS) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
      const n = at(nx, ny);
      if (grid[n] === WALL) continue;
      const tentative = gScore[cur] + 1;
      if (tentative < gScore[n]) {
        gScore[n] = tentative;
        f[n] = tentative + hx(n);
        parent[n] = cur;
        if (!inHeap[n]) push(n);
      }
    }
  }

  const path: number[] = [];
  for (let i = goal; i !== -1; i = parent[i]) path.push(i);
  path.reverse();
  return { visits, path };
}

export function AStarMaze() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [runId, setRunId] = useState(0);
  const [stats, setStats] = useState({ visited: 0, path: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const cell = Math.max(4, Math.floor(w / COLS));
    const W = cell * COLS;
    const H = cell * ROWS;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const grid = carveMaze();
    const order =
      (grid as Uint8Array & { order?: Cell[][] }).order ?? [];
    const { visits, path } = solve(grid);
    setStats({ visited: visits.length, path: path.length });

    const ink = "#0a0a0e";
    const wallC = "#1c1c26";
    const boneDim = "rgba(234,232,227,0.10)";
    const cyan = "rgba(89,199,242,0.55)";
    const amber = "#ffb703";

    const rect = (i: number, color: string, inset = 0) => {
      const x = (i % COLS) * cell;
      const y = ((i / COLS) | 0) * cell;
      ctx.fillStyle = color;
      ctx.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
    };

    const drawBase = () => {
      ctx.fillStyle = wallC;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === OPEN) rect(i, ink);
      }
    };

    let raf = 0;
    let stopped = false;
    let phase = 0; // 0 carve, 1 solve, 2 path
    let ci = 0;
    let vi = 0;
    let pi = 0;

    if (reduced) {
      // final state, no animation
      drawBase();
      for (const v of visits) rect(v.cell, boneDim);
      for (const p of path) rect(p, amber, Math.max(1, cell * 0.22));
      return;
    }

    ctx.fillStyle = wallC;
    ctx.fillRect(0, 0, W, H);
    rect(1 * COLS + 1, ink);

    const tick = () => {
      if (stopped) return;
      if (phase === 0) {
        const steps = Math.max(3, Math.ceil(order.length / 90));
        for (let s = 0; s < steps && ci < order.length; s++, ci++) {
          for (const [x, y] of order[ci]) rect(y * COLS + x, ink);
        }
        if (ci >= order.length) phase = 1;
      } else if (phase === 1) {
        const steps = Math.max(2, Math.ceil(visits.length / 140));
        for (let s = 0; s < steps && vi < visits.length; s++, vi++) {
          rect(visits[vi].cell, boneDim);
          if (s === steps - 1) {
            for (const fcell of visits[vi].frontier) rect(fcell, cyan);
          }
        }
        if (vi >= visits.length) {
          // clear frontier tint before tracing
          drawBase();
          for (const v of visits) rect(v.cell, boneDim);
          phase = 2;
        }
      } else {
        const steps = 3;
        for (let s = 0; s < steps && pi < path.length; s++, pi++) {
          rect(path[pi], amber, Math.max(1, cell * 0.22));
        }
        if (pi >= path.length) {
          rect(1 * COLS + 1, "#59c7f2", 0);
          rect((ROWS - 2) * COLS + COLS - 2, "#59c7f2", 0);
          return; // done
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [runId]);

  return (
    <div className="maze" data-cursor="demo">
      <canvas ref={canvasRef} className="maze-canvas" aria-label="A* maze solver visualization" />
      <div className="demo-controls">
        <button
          className="demo-btn mono-label"
          onClick={() => setRunId((r) => r + 1)}
          data-cursor="link"
        >
          ↻ REGENERATE
        </button>
        <span className="mono-label demo-stat">
          VISITED {stats.visited} / PATH {stats.path}
        </span>
      </div>
    </div>
  );
}
