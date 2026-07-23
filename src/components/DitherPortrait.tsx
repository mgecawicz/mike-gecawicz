import { useEffect, useRef } from "react";

// 4×4 Bayer matrix for ordered dithering.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/**
 * The portrait, run through ordered Bayer dithering into a two-tone
 * amber-on-ink bitmap, rendered chunky. Hovering dissolves it into the
 * actual photograph.
 */
export function DitherPortrait({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.src = src;
    img.decode().then(() => {
      // Small internal resolution = visible pixels once upscaled.
      const W = 148;
      const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H);
      const px = data.data;

      const ink = [10, 10, 14];
      const amber = [255, 183, 3];
      const bone = [234, 232, 227];

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const lum =
            (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
          const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
          // three tones: dark, amber midtone, bone highlight
          let c = ink;
          if (lum > threshold * 0.9 + 0.35) c = bone;
          else if (lum > threshold * 0.85) c = amber;
          px[i] = c[0];
          px[i + 1] = c[1];
          px[i + 2] = c[2];
          px[i + 3] = 255;
        }
      }
      ctx.putImageData(data, 0, 0);
    }).catch(() => {
      /* leave the plain img visible */
    });
  }, [src]);

  return (
    <figure className="dither" data-cursor="portrait">
      <img className="dither-photo" src={src} alt={alt} loading="lazy" />
      <canvas ref={canvasRef} className="dither-canvas" aria-hidden="true" />
      <figcaption className="mono-label dither-tag">
        BAYER 4×4 / HOVER TO DECODE
      </figcaption>
    </figure>
  );
}
