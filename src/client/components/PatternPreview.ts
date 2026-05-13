import { html, TemplateResult } from "lit";
import { PlayerPattern } from "../../core/Schemas";
import { translateText } from "../Utils";

const PRIMARY = "#C8973A";
const SECONDARY = "#1C2B1E";
const TILE = 16;

export function renderPatternPreview(
  pattern: PlayerPattern | null,
  width: number,
  height: number,
): TemplateResult {
  if (pattern === null) {
    return renderBlankPreview();
  }
  const dataUrl = generatePreviewDataUrl(pattern, width, height);
  if (!dataUrl) return renderBlankPreview();
  return html`<img
    src="${dataUrl}"
    alt="Pattern preview"
    class="w-full h-full object-contain [image-rendering:pixelated] pointer-events-none"
    draggable="false"
  />`;
}

function renderBlankPreview(): TemplateResult {
  return html`
    <div
      class="flex items-center justify-center h-full w-full rounded overflow-hidden relative"
      style="background:#1C2B1E;border:1px solid #C8973A40;"
    >
      <span
        class="text-[10px] font-black uppercase leading-none break-words w-full text-center"
        style="color:#C8973A80;"
      >
        ${translateText("territory_patterns.select_skin")}
      </span>
    </div>
  `;
}

const previewCache = new Map<string, string>();

export function generatePreviewDataUrl(
  pattern: PlayerPattern,
  width = 64,
  height = 64,
): string {
  const primary = pattern.colorPalette?.primaryColor ?? PRIMARY;
  const secondary = pattern.colorPalette?.secondaryColor ?? SECONDARY;
  const name = pattern.name ?? "stripes";
  const key = `${name}|${primary}|${secondary}|${width}x${height}`;

  if (previewCache.has(key)) return previewCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  drawPattern(ctx, width, height, primary, secondary, name);

  const url = canvas.toDataURL("image/png");
  previewCache.set(key, url);
  return url;
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  primary: string,
  secondary: string,
  name: string,
): void {
  ctx.fillStyle = secondary;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = primary;

  switch (name) {
    case "stripes":
      for (let x = 0; x < w; x += TILE) {
        ctx.fillRect(x, 0, TILE / 2, h);
      }
      break;

    case "checkerboard": {
      const half = TILE / 2;
      for (let y = 0; y < h; y += half) {
        for (let x = 0; x < w; x += half) {
          if ((Math.floor(x / half) + Math.floor(y / half)) % 2 === 0) {
            ctx.fillRect(x, y, half, half);
          }
        }
      }
      break;
    }

    case "dots":
      for (let y = TILE / 2; y < h + TILE; y += TILE) {
        for (let x = TILE / 2; x < w + TILE; x += TILE) {
          ctx.beginPath();
          ctx.arc(x, y, TILE / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case "diagonal":
      ctx.strokeStyle = primary;
      ctx.lineWidth = TILE / 3;
      for (let d = -h; d < w + h; d += TILE) {
        ctx.beginPath();
        ctx.moveTo(d, 0);
        ctx.lineTo(d + h, h);
        ctx.stroke();
      }
      break;

    case "cross":
      for (let y = TILE / 4; y < h; y += TILE) {
        ctx.fillRect(0, y, w, TILE / 2);
      }
      for (let x = TILE / 4; x < w; x += TILE) {
        ctx.fillRect(x, 0, TILE / 2, h);
      }
      break;

    case "flames": {
      for (let fx = 0; fx < w; fx += TILE) {
        ctx.beginPath();
        ctx.moveTo(fx, h);
        ctx.bezierCurveTo(
          fx + TILE * 0.2,
          h * 0.6,
          fx + TILE * 0.8,
          h * 0.4,
          fx + TILE / 2,
          h * 0.1,
        );
        ctx.bezierCurveTo(
          fx + TILE * 0.3,
          h * 0.4,
          fx + TILE * 0.7,
          h * 0.6,
          fx + TILE,
          h,
        );
        ctx.closePath();
        ctx.fill();
      }
      break;
    }

    case "camo": {
      const blobs: [number, number, number][] = [
        [0.1, 0.1, 0.25],
        [0.5, 0.15, 0.2],
        [0.8, 0.05, 0.18],
        [0.25, 0.5, 0.22],
        [0.65, 0.45, 0.2],
        [0.1, 0.75, 0.18],
        [0.45, 0.78, 0.2],
        [0.82, 0.72, 0.22],
      ];
      for (const [bx, by, br] of blobs) {
        ctx.beginPath();
        ctx.arc(bx * w, by * h, br * Math.min(w, h), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case "circuit":
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2;
      for (let y = TILE / 2; y < h; y += TILE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = TILE / 2; x < w; x += TILE * 2) {
        for (let y = TILE / 2; y < h - TILE; y += TILE * 2) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + TILE);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case "scales": {
      const sw = TILE;
      const sh = Math.round(TILE * 0.75);
      for (let row = 0; row * sh < h + sh; row++) {
        const offsetX = row % 2 === 0 ? 0 : sw / 2;
        for (let col = -1; col * sw < w + sw; col++) {
          const cx = col * sw + offsetX;
          const cy = row * sh;
          ctx.beginPath();
          ctx.ellipse(cx, cy, sw / 2 - 1, sh - 1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case "stars":
      for (let y = TILE; y < h + TILE; y += TILE * 2) {
        for (let x = TILE; x < w + TILE; x += TILE * 2) {
          drawStar(ctx, x, y, 5, TILE * 0.4, TILE * 0.18);
        }
      }
      break;

    case "waves":
      ctx.strokeStyle = primary;
      ctx.lineWidth = TILE / 4;
      for (let y = TILE / 2; y < h + TILE; y += TILE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 2; x <= w; x += 2) {
          ctx.lineTo(x, y + Math.sin((x / w) * Math.PI * 4) * (TILE / 3));
        }
        ctx.stroke();
      }
      break;

    case "crown": {
      const cw = w * 0.7;
      const ch = h * 0.6;
      const cx = (w - cw) / 2;
      const cy = (h - ch) / 2;
      ctx.fillRect(cx, cy + ch * 0.5, cw, ch * 0.5);
      ctx.beginPath();
      ctx.moveTo(cx, cy + ch * 0.5);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + cw * 0.25, cy + ch * 0.35);
      ctx.lineTo(cx + cw * 0.5, cy);
      ctx.lineTo(cx + cw * 0.75, cy + ch * 0.35);
      ctx.lineTo(cx + cw, cy);
      ctx.lineTo(cx + cw, cy + ch * 0.5);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "lightning": {
      const lx = w / 2;
      ctx.beginPath();
      ctx.moveTo(lx + w * 0.1, h * 0.05);
      ctx.lineTo(lx - w * 0.15, h * 0.5);
      ctx.lineTo(lx + w * 0.05, h * 0.5);
      ctx.lineTo(lx - w * 0.1, h * 0.95);
      ctx.lineTo(lx + w * 0.15, h * 0.45);
      ctx.lineTo(lx, h * 0.45);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "tribal": {
      const ts = TILE;
      for (let ty = 0; ty < h + ts; ty += ts) {
        for (let tx = 0; tx < w + ts; tx += ts) {
          const dx = tx + (Math.floor(ty / ts) % 2 === 0 ? 0 : ts / 2);
          ctx.beginPath();
          ctx.moveTo(dx, ty - ts * 0.4);
          ctx.lineTo(dx + ts * 0.4, ty);
          ctx.lineTo(dx, ty + ts * 0.4);
          ctx.lineTo(dx - ts * 0.4, ty);
          ctx.closePath();
          ctx.fill();
        }
      }
      break;
    }

    case "pixel": {
      const ps = TILE / 2;
      for (let py = 0; py < h; py += ps) {
        for (let px = 0; px < w; px += ps) {
          const v = Math.abs(Math.sin(px * 127.1 + py * 311.7) * 43758.5453) % 1;
          if (v > 0.5) {
            ctx.fillRect(px, py, ps, ps);
          }
        }
      }
      break;
    }

    default:
      for (let x = 0; x < w; x += TILE) {
        ctx.fillRect(x, 0, TILE / 2, h);
      }
      break;
  }
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  points: number,
  outer: number,
  inner: number,
): void {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}
