# mkgz.me — Mike Gecawicz

Personal site, v3. React 19 + Vite + TypeScript, and deliberately nothing else —
every animation, shader, and interaction is hand-rolled.

## The parts that make people ask questions

- **Hero** — ~42,000 GPU particles simulated entirely on the GPU via WebGL2
  transform feedback (ping-ponged position/velocity buffers, rasterizer
  discarded during the update pass). Particles assemble the name from glyphs
  rasterized to an offscreen canvas, flee the cursor, detonate on click, and
  melt into turbulence as you scroll. Falls back to static type without WebGL2
  or with `prefers-reduced-motion`.
- **Lab** — three live demos honoring the legacy site:
  - `collatz.wasm` — the original 115-byte binary, fetched and instantiated
    as-is, with an animated log-scale orbit trace.
  - Boids — the flocking algorithm ported from the old `Boid.ts` (same rules,
    same weights) plus a uniform spatial hash for a 4× bigger flock.
  - A* maze — recursive-backtracking generation and A* solve (binary-heap
    frontier), animated on canvas.
- **Chrome** — command palette (⌘K), corner HUD with live FPS/particle
  count/scroll depth, custom cursor, Bayer-dithered portrait, film grain,
  CRT mode (Konami code or ⌘K → "crt").

## Commands

```sh
npm run dev      # dev server
npm run build    # type-check + production build
npm run preview  # serve the production build
npm run legacy   # run the old Vue site (cd legacy && npm i first)
```

## Layout

- `src/gl/` — the particle engine (`ParticleField.ts`) and GLSL sources
- `src/components/` — sections + `demos/` for the Lab
- `src/content.ts` — every fact and word on the site, in one file
- `public/media/` — compressed renders/loops (sources in `legacy/src/{images,videos}`)
- `legacy/` — the 2024 Vue site, preserved intact

## Fonts

Space Grotesk (display), Inter (body), Departure Mono (labels/HUD) — all
self-hosted, variable where available.
