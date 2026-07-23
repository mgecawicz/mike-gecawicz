import { UPDATE_VS, UPDATE_FS, RENDER_VS, RENDER_FS } from "./shaders";

export type FieldStats = { fps: number; count: number };

export type FieldOptions = {
  lines: string[];
  onStats?: (s: FieldStats) => void;
};

/**
 * GPU particle field. ~10k–40k particles are born scattered, spring into
 * glyph targets sampled from an offscreen 2D canvas, and are pushed around
 * by the pointer / click shockwaves / scroll-driven turbulence.
 *
 * The simulation is a transform-feedback ping-pong: two {position, velocity}
 * buffer pairs, updated by a vertex shader with the rasterizer discarded,
 * then rendered as additive points. No libraries.
 */
export class ParticleField {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;
  private opts: FieldOptions;

  private updateProg!: WebGLProgram;
  private renderProg!: WebGLProgram;
  private posBufs: WebGLBuffer[] = [];
  private velBufs: WebGLBuffer[] = [];
  private targetBuf: WebGLBuffer | null = null;
  private seedBuf: WebGLBuffer | null = null;
  private updateVAOs: WebGLVertexArrayObject[] = [];
  private renderVAOs: WebGLVertexArrayObject[] = [];
  private tfs: WebGLTransformFeedback[] = [];
  private cur = 0;
  private count = 0;

  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private rUniforms: Record<string, WebGLUniformLocation | null> = {};

  private raf = 0;
  private running = false;
  private destroyed = false;
  private lastT = 0;
  private time = 0;

  private pointer = { x: 2, y: 2, tx: 2, ty: 2, active: 0 };
  private scatter = 0;
  private scatterTarget = 0;
  private pulse = { x: 0, y: 0, age: 10, strength: 0 };

  private frames = 0;
  private statT = 0;

  private resizeObserver: ResizeObserver | null = null;
  private resizeTimer = 0;

  constructor(canvas: HTMLCanvasElement, opts: FieldOptions) {
    this.canvas = canvas;
    this.opts = opts;
  }

  /** True if WebGL2 was available and the field is live. */
  async init(): Promise<boolean> {
    const gl = this.canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return false;
    this.gl = gl;

    try {
      await document.fonts.load('700 100px "Space Grotesk"');
    } catch {
      /* fall back to whatever is loaded */
    }

    this.updateProg = this.link(UPDATE_VS, UPDATE_FS, ["v_pos", "v_vel"]);
    this.renderProg = this.link(RENDER_VS, RENDER_FS);

    for (const n of [
      "u_dt",
      "u_time",
      "u_mouse",
      "u_mouseActive",
      "u_scatter",
      "u_aspect",
      "u_pulse",
    ]) {
      this.uniforms[n] = gl.getUniformLocation(this.updateProg, n);
    }
    for (const n of ["u_dpr", "u_scatter"]) {
      this.rUniforms[n] = gl.getUniformLocation(this.renderProg, n);
    }

    this.buildParticles();

    this.canvas.addEventListener("webglcontextlost", this.onContextLost);

    this.resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        if (!this.destroyed) this.buildParticles();
      }, 180);
    });
    this.resizeObserver.observe(this.canvas);
    return true;
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.stop();
  };

  private link(vs: string, fs: string, varyings?: string[]): WebGLProgram {
    const gl = this.gl!;
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh) ?? "shader compile failed");
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    if (varyings) {
      gl.transformFeedbackVaryings(prog, varyings, gl.SEPARATE_ATTRIBS);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) ?? "program link failed");
    }
    return prog;
  }

  /** Rasterize the name into point targets, then (re)allocate GPU state. */
  private buildParticles() {
    const gl = this.gl;
    if (!gl) return;

    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    const targets = this.sampleGlyphs(w, h);
    const n = targets.length / 2;
    this.count = n;

    const pos = new Float32Array(n * 2);
    const vel = new Float32Array(n * 2);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // Born scattered across (and slightly beyond) the viewport,
      // so the name assembles itself on load.
      pos[i * 2] = (Math.random() * 2 - 1) * 1.3;
      pos[i * 2 + 1] = (Math.random() * 2 - 1) * 1.3;
      vel[i * 2] = (Math.random() - 0.5) * 0.004;
      vel[i * 2 + 1] = (Math.random() - 0.5) * 0.004;
      seed[i] = Math.random();
    }

    // Tear down any previous allocation.
    for (const b of [...this.posBufs, ...this.velBufs]) gl.deleteBuffer(b);
    if (this.targetBuf) gl.deleteBuffer(this.targetBuf);
    if (this.seedBuf) gl.deleteBuffer(this.seedBuf);
    for (const v of [...this.updateVAOs, ...this.renderVAOs]) {
      gl.deleteVertexArray(v);
    }
    for (const t of this.tfs) gl.deleteTransformFeedback(t);
    this.posBufs = [];
    this.velBufs = [];
    this.updateVAOs = [];
    this.renderVAOs = [];
    this.tfs = [];

    const mkBuf = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_COPY);
      return b;
    };
    this.posBufs = [mkBuf(pos), mkBuf(pos)];
    this.velBufs = [mkBuf(vel), mkBuf(vel)];
    this.targetBuf = mkBuf(new Float32Array(targets));
    this.seedBuf = mkBuf(seed);

    const attrib = (
      buf: WebGLBuffer,
      loc: number,
      size: number,
    ) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };

    for (let i = 0; i < 2; i++) {
      // Update VAO i reads state i; TF i writes state 1-i.
      const uv = gl.createVertexArray()!;
      gl.bindVertexArray(uv);
      attrib(this.posBufs[i], 0, 2);
      attrib(this.velBufs[i], 1, 2);
      attrib(this.targetBuf, 2, 2);
      attrib(this.seedBuf, 3, 1);
      this.updateVAOs.push(uv);

      const tf = gl.createTransformFeedback()!;
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.posBufs[1 - i]);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.velBufs[1 - i]);
      this.tfs.push(tf);

      const rv = gl.createVertexArray()!;
      gl.bindVertexArray(rv);
      attrib(this.posBufs[i], 0, 2);
      attrib(this.velBufs[i], 1, 2);
      attrib(this.seedBuf, 2, 1);
      this.renderVAOs.push(rv);
    }
    gl.bindVertexArray(null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.cur = 0;
  }

  /** Draw the name on an offscreen canvas and lift filled pixels into clip space. */
  private sampleGlyphs(w: number, h: number): number[] {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d", { willReadFrequently: true })!;

    const lines = this.opts.lines;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";

    // Scale type so the longest line spans ~88% of the viewport width.
    let fontSize = 100;
    ctx.font = `700 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
    const longest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    fontSize = Math.min((0.88 * w * fontSize) / longest, h * 0.34);
    ctx.font = `700 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;

    const lineGap = fontSize * 1.02;
    const blockH = lineGap * (lines.length - 1);
    const cy = h * 0.46 - blockH / 2;
    lines.forEach((line, i) => {
      const tw = ctx.measureText(line).width;
      ctx.fillText(line, (w - tw) / 2, cy + i * lineGap + fontSize * 0.36);
    });

    const img = ctx.getImageData(0, 0, w, h).data;
    const isMobile = w < 640;
    const step = isMobile ? 3 : 2;
    const cap = isMobile ? 14000 : 42000;

    const pts: number[] = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (img[(y * w + x) * 4 + 3] > 128) {
          const jx = x + (Math.random() - 0.5) * step;
          const jy = y + (Math.random() - 0.5) * step;
          pts.push((jx / w) * 2 - 1, -((jy / h) * 2 - 1));
        }
      }
    }

    // Down-sample uniformly if over budget.
    const n = pts.length / 2;
    if (n > cap) {
      const out: number[] = [];
      const stride = n / cap;
      for (let i = 0; i < cap; i++) {
        const j = Math.floor(i * stride) * 2;
        out.push(pts[j], pts[j + 1]);
      }
      return out;
    }
    return pts;
  }

  start() {
    if (this.running || !this.gl || this.destroyed) return;
    this.running = true;
    this.lastT = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      this.frame(t);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    this.resizeObserver?.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    const gl = this.gl;
    if (gl) {
      for (const b of [...this.posBufs, ...this.velBufs]) gl.deleteBuffer(b);
      if (this.targetBuf) gl.deleteBuffer(this.targetBuf);
      if (this.seedBuf) gl.deleteBuffer(this.seedBuf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  }

  setPointer(clientX: number, clientY: number, active: boolean) {
    const r = this.canvas.getBoundingClientRect();
    this.pointer.tx = ((clientX - r.left) / r.width) * 2 - 1;
    this.pointer.ty = -(((clientY - r.top) / r.height) * 2 - 1);
    this.pointer.active = active ? 1 : 0;
  }

  /** 0 = name held together, 1 = fully melted (driven by scroll). */
  setScatter(v: number) {
    this.scatterTarget = Math.max(0, Math.min(1, v));
  }

  pulseAt(clientX: number, clientY: number) {
    const r = this.canvas.getBoundingClientRect();
    this.pulse.x = ((clientX - r.left) / r.width) * 2 - 1;
    this.pulse.y = -(((clientY - r.top) / r.height) * 2 - 1);
    this.pulse.age = 0;
    this.pulse.strength = 1;
  }

  private frame(t: number) {
    const gl = this.gl!;
    const dt = Math.min((t - this.lastT) / 1000, 0.05);
    this.lastT = t;
    this.time += dt;

    // Smooth pointer + scatter in JS so the shader sees eased values.
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.16;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.16;
    this.scatter += (this.scatterTarget - this.scatter) * 0.08;
    this.pulse.age += dt;
    this.pulse.strength *= Math.pow(0.02, dt); // fast decay

    const aspect =
      this.canvas.height > 0 ? this.canvas.width / this.canvas.height : 1;

    // --- simulate ---
    gl.useProgram(this.updateProg);
    gl.uniform1f(this.uniforms.u_dt, dt);
    gl.uniform1f(this.uniforms.u_time, this.time);
    gl.uniform2f(this.uniforms.u_mouse, this.pointer.x, this.pointer.y);
    gl.uniform1f(this.uniforms.u_mouseActive, this.pointer.active);
    gl.uniform1f(this.uniforms.u_scatter, this.scatter);
    gl.uniform1f(this.uniforms.u_aspect, aspect);
    gl.uniform4f(
      this.uniforms.u_pulse,
      this.pulse.x,
      this.pulse.y,
      this.pulse.age,
      this.pulse.strength,
    );

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindVertexArray(this.updateVAOs[this.cur]);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.tfs[this.cur]);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, this.count);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);

    this.cur = 1 - this.cur;

    // --- render ---
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(this.renderProg);
    gl.uniform1f(this.rUniforms.u_dpr, Math.min(window.devicePixelRatio, 1.75));
    gl.uniform1f(this.rUniforms.u_scatter, this.scatter);
    gl.bindVertexArray(this.renderVAOs[this.cur]);
    gl.drawArrays(gl.POINTS, 0, this.count);
    gl.bindVertexArray(null);

    // --- stats ---
    this.frames++;
    this.statT += dt;
    if (this.statT >= 0.5) {
      this.opts.onStats?.({
        fps: Math.round(this.frames / this.statT),
        count: this.count,
      });
      this.frames = 0;
      this.statT = 0;
    }
  }
}
