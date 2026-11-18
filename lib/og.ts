// Link-preview image (option 7a): 1200 × 630 PNG rendered with resvg when the sweet is created.
// Satori can't do SVG filters, so the hand-drawn candy is rasterised from the real engine output.
import 'server-only';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { candy, tray } from './art';
import { stickerName, type Sweet } from './sweet';
import { DATA_DIR } from './store';

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts');
const fontFiles = () => fs.readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));

/** Same polka paper as the app: 14px dots on a 48px grid, offset 24px. */
const POLKA = `<defs><pattern id="pk" patternUnits="userSpaceOnUse" width="48" height="48"><rect width="48" height="48" fill="#FCF7EF"/><circle cx="24" cy="24" r="7.4" fill="#F5CDD3"/><circle cx="0" cy="0" r="7.4" fill="#F5CDD3"/><circle cx="48" cy="0" r="7.4" fill="#F5CDD3"/><circle cx="0" cy="48" r="7.4" fill="#F5CDD3"/><circle cx="48" cy="48" r="7.4" fill="#F5CDD3"/></pattern></defs><rect width="1200" height="630" fill="url(#pk)"/>`;

/** Place an engine SVG string (with its own viewBox) at a position and size. */
function place(svg: string, x: number, y: number, w: number, h: number) {
  return svg.replace(/^<svg([^>]*)>/, (_m, attrs: string) =>
    `<svg${attrs.replace(/\s(width|height|style)="[^"]*"/g, '')} x="${x}" y="${y}" width="${w}" height="${h}" overflow="visible">`);
}

export function ogSvg(s: Pick<Sweet, 'paper' | 'ribbon' | 'sticker' | 'to'>) {
  const c = candy({ fab: s.paper, rib: s.ribbon, sticker: s.sticker, name: stickerName(s.to), labelScale: 1.3 });
  const trayAt = (part: 'back' | 'front') => `<g transform="translate(241.4,-123.3) scale(1.8391)">${place(tray(part), 0, 0, 390, 470)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${POLKA}${trayAt('back')}${place(c, 280, 182, 640, 640 * 200 / 360)}${trayAt('front')}</svg>`;
}

/**
 * resvg panics (aborting the process) on feDisplacementMap when the pen-jitter filter uses the engine's
 * large user-space region. For rasterising only, swap that region for a bounding-box one; the drawing
 * itself is unchanged and the jitter looks the same.
 */
const RESVG_SAFE = (svg: string) =>
  svg.replace(/filterUnits="userSpaceOnUse" x="-100" y="-100" width="1200" height="1100"/g, 'x="-20%" y="-20%" width="140%" height="140%"');

export function renderOgPng(s: Pick<Sweet, 'paper' | 'ribbon' | 'sticker' | 'to'>): Buffer {
  const r = new Resvg(RESVG_SAFE(ogSvg(s)), {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: false, fontFiles: fontFiles(), defaultFontFamily: 'Work Sans' },
  });
  return r.render().asPng();
}

const ogPath = (id: string) => path.join(DATA_DIR, 'og', `${id}.png`);

export function saveOgPng(s: Sweet) {
  fs.mkdirSync(path.dirname(ogPath(s.id)), { recursive: true });
  fs.writeFileSync(ogPath(s.id), renderOgPng(s));
}

/** Reads the stored PNG, re-rendering it if it's missing. */
export function loadOgPng(s: Sweet): Buffer {
  try { return fs.readFileSync(ogPath(s.id)); } catch { saveOgPng(s); return fs.readFileSync(ogPath(s.id)); }
}
