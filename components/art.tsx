'use client';
// Memoized React wrappers around the illustration engine. The SVG strings are heavy, so each one
// is generated once per set of props and injected with dangerouslySetInnerHTML.
import { memo, useMemo, type CSSProperties } from 'react';
import * as A from '@/lib/art';

type HtmlProps = { html: string; style?: CSSProperties; center?: boolean };
export const Html = memo(function Html({ html, style, center }: HtmlProps) {
  const s: CSSProperties = center
    ? { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }
    : { width: '100%', height: '100%', ...style };
  return <div style={s} dangerouslySetInnerHTML={{ __html: html }} />;
});

function useSvg(fn: () => string, deps: unknown[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(fn, deps);
}

export const Candy = memo(function Candy(p: A.CandyOpts & { replay?: number }) {
  const html = useSvg(() => A.candy(p), [p.fab, p.rib, p.sticker, p.name, p.pose, p.dur, p.labelScale, p.replay]);
  return <Html html={html} />;
});

/** One layer of the candy (body, endL, endR, bowL, bowR) with the pen jitter. */
export const CandyPiece = memo(function CandyPiece(p: A.CandyOpts & { only: A.Layer }) {
  const html = useSvg(() => A.hand(A.candyRaw(p)), [p.fab, p.rib, p.sticker, p.name, p.only]);
  return <Html html={html} />;
});

export const Tray = memo(function Tray({ part }: { part: 'back' | 'front' }) {
  const html = useSvg(() => A.tray(part), [part]);
  return <Html html={html} />;
});

export const FabricSwatch = memo(function FabricSwatch({ k }: { k: string }) {
  const html = useSvg(() => A.fabricSwatch(k), [k]);
  return <Html html={html} />;
});

export const RibbonSwatch = memo(function RibbonSwatch({ k }: { k: string }) {
  const html = useSvg(() => A.ribbonSwatch(k), [k]);
  return <Html html={html} />;
});

export const Sticker = memo(function Sticker({ k, name }: { k: string; name: string }) {
  const html = useSvg(() => A.stickerSwatch(k, name), [k, name]);
  return <Html html={html} />;
});

export const NoteCard = memo(function NoteCard(p: { style: string; w: number; h: number; shadow?: boolean; sw?: number; center?: boolean }) {
  const html = useSvg(() => A.noteCard(p), [p.style, p.w, p.h, p.shadow, p.sw]);
  return <Html html={html} center={p.center} />;
});

export const Confetti = memo(function Confetti(p: A.ConfettiOpts & { replay?: number }) {
  const html = useSvg(() => A.confetti(p), [p.w, p.h, p.cx, p.cy, p.n, p.min, p.spread, p.stars, p.delay, p.dur, p.replay]);
  return <Html html={html} />;
});

/** Polka-dot paper. */
export const polka = 'var(--polka)';

/** Tray back + candy + tray front, positioned as in the prototypes. */
export function CandyInTray(p: {
  trayLeft: number; trayTop: number; trayScale: number;
  candyLeft: number; candyTop: number; candyWidth: number;
  candy: A.CandyOpts & { replay?: number }; candyStyle?: CSSProperties;
}) {
  const tray: CSSProperties = { position: 'absolute', left: p.trayLeft, top: p.trayTop, width: 390, height: 470, transform: `scale(${p.trayScale})`, transformOrigin: '0 0', pointerEvents: 'none' };
  return (
    <>
      <div style={tray}><Tray part="back" /></div>
      <div style={{ position: 'absolute', left: p.candyLeft, top: p.candyTop, width: p.candyWidth, ...p.candyStyle }}><Candy {...p.candy} /></div>
      <div style={tray}><Tray part="front" /></div>
    </>
  );
}
