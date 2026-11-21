// Layout rules from SweetLaptop.dc.html / SweetPhone.dc.html, as pure functions of the viewport.

export const PHONE_BREAKPOINT = 900;

export type Motion = { dur: number; cdur: number; delay: number; hold: number };
export const LAPTOP_MOTION: Motion = { dur: 1.9, cdur: 1.35, delay: 1.05, hold: 2350 };
export const PHONE_MOTION: Motion = { dur: 1.5, cdur: 1, delay: 0.8, hold: 1750 };

/** Laptop canvas: W × H design pixels, shown at `scale` inside the dark letterbox. */
export function laptopGeo(vw: number, vh: number, preview = false) {
  // From 900–1023 wide or under 720 tall the whole canvas scales down; above 1920 × 1200 it scales up.
  const scale = vw < 1024 || vh < 720 ? Math.min(vw / 1024, vh / 720) : Math.max(1, Math.min(vw / 1920, vh / 1200));
  const W = Math.round(vw / scale), H = Math.round(vh / scale);
  // Panel: 580 at 1360+, 500 from 1200, 440 from 1024 (60 / 40 at 1440).
  const P = W >= 1360 ? 580 : W >= 1200 ? 500 : 440, tight = H < 860;
  const pn = {
    w: P, sw: tight ? 52 : 62, card: tight ? 56 : 68, ta: tight ? 92 : 120,
    ...(P >= 560 ? { pad: '52px 56px 44px', gap: 18, title: 40 } : P >= 480 ? { pad: '44px 44px 36px', gap: 16, title: 36 } : { pad: '36px 36px 30px', gap: 14, title: 32 }),
  };
  if (tight) { pn.gap -= 4; pn.pad = pn.pad.replace(/^\d+px/, (m) => parseInt(m) - 12 + 'px'); }
  const SW = W - P, gk = Math.min(1.2, SW / 860, H / 900);
  const gs = { k: gk, left: Math.round((SW - 860 * gk) / 2), top: Math.round((H - 900 * gk) / 2) };
  const rk = Math.min(1.2, W / 1440, H / 900), rvTop = Math.round((H - 900 * rk) / 2);
  const pv = preview ? 56 : 0;
  const rv = { k: rk, left: Math.round((W - 1440 * rk) / 2), top: rvTop + pv / 2, pill: Math.max(28, Math.round(rvTop + 96 * rk)) + pv, tap: Math.round(rvTop + 740 * rk) + pv / 2 };
  const k1 = Math.min(1.15, W / 1440, (H - 300) / 600), g1Top = Math.max(0, Math.round((H - 632 * k1 - 276) / 2) - 14);
  const g1 = { k: k1, left: Math.round((W - 1440 * k1) / 2), top: g1Top, cardTop: Math.min(Math.round(g1Top + 572 * k1), H - 300) };
  const r5w = P >= 500 ? 480 : 420;
  const r5 = { w: r5w, left: SW + Math.max(0, Math.round((P - r5w) / 2)) - 30, top: Math.round((H - 400) / 2) };
  return { scale, W, H, P, tight, pn, SW, gs, rv, g1, r5, pv, wrapGap: H < 760 ? '14px 0 16px' : '16px 0 20px', showNotes: H >= 760 };
}
export type LaptopGeo = ReturnType<typeof laptopGeo>;

/** Phone canvas: a 390-wide design scaled to the device width; ch is the canvas height in design px. */
export function phoneGeo(vw: number, vh: number) {
  const ds = vw / 390, ch = Math.round(vh / ds), dy = ch - 844, tight = dy < -60;
  const fitG = (a: number, b: number, a2: number, b2: number) => { const k = Math.min(1, (b2 - a2) / (b - a)); return { k: +k.toFixed(3), y: Math.round(a2 - a * k) }; };
  const sheet2 = tight ? ch - 330 : 392, sheet3 = tight ? ch - 410 : 392;
  return {
    ds, ch, dy, tight, sheet2, sheet3, showNote: !tight, cardTile: tight ? 44 : 54, ta: tight ? 60 : 88,
    g1: dy < 0 ? fitG(130, 540, 60, 540 + dy) : { k: 1, y: 0 },
    g2: fitG(100, 392, 100, sheet2), g3: fitG(110, 316, 104, sheet3 - 6), g4: fitG(100, 352, 100, sheet3 - 8),
    g5: dy < 0 ? fitG(140, 470, 60, 470 + dy) : { k: 1, y: 0 },
  };
}
export type PhoneGeo = ReturnType<typeof phoneGeo>;

/**
 * S3 "Write your note" resting layout (option 4a), in design px for a canvas `ch` tall.
 * Top to bottom: step bar, card preview (250 wide, rotated), then a sheet that runs to the bottom
 * with Back / Next pinned near it. On short screens the card shrinks first, then the picker tiles,
 * then the gaps and the message box, so Back / Next always stay in view.
 */
export function phoneS3(ch: number, heart: boolean) {
  const cardH = heart ? 194 : 170, stepBottom = 94;
  // [gap under step bar, gap card→sheet, tile, sheet gap, message, gap above buttons, buttons from bottom]
  const steps = [
    [22, 34, 46, 12, 72, 16, 26],
    [12, 26, 46, 12, 72, 16, 26],
    [10, 24, 44, 12, 72, 14, 24],
    [10, 20, 44, 10, 64, 12, 22],
    [8, 16, 44, 8, 56, 10, 18],
  ];
  const BTN = 54;
  const fit = (s: number[]) => {
    const [gTop, gSheet, tile, gap, msg, gBtn, bottom] = s;
    // padding 20 + title 29 + picker (4 + tile + 7 + 11) + To/From 61 + message label 17 + message, plus three gaps.
    const content = 20 + 29 + (22 + tile) + 61 + (17 + msg) + 3 * gap;
    const need = content + gBtn + BTN + bottom;
    const cardTop = stepBottom + gTop;
    const k = Math.min(1, (ch - need - gSheet - cardTop) / cardH);
    return { gTop, gSheet, tile, gap, msg, bottom, cardTop, k };
  };
  let g = fit(steps[0]);
  for (const s of steps) { g = fit(s); if (g.k >= 0.6) break; }
  const k = +Math.max(0.4, g.k).toFixed(3);
  const sheetTop = Math.round(g.cardTop + cardH * k + g.gSheet);
  return { cardH, cardTop: g.cardTop, k, sheetTop, tile: g.tile, gap: g.gap, msg: g.msg, bottom: g.bottom };
}
export type PhoneS3 = ReturnType<typeof phoneS3>;
