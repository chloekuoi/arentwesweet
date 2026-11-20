'use client';
import type { CSSProperties, ReactNode } from 'react';
import { Candy, CandyInTray, CandyPiece, Confetti, NoteCard, Sticker, Tray } from '@/components/art';
import { ArrivalPlaque, Sunburst, UnwrapButton, EyeIcon, IouCoupon, MuteButton, PrimaryButton, PrimaryLink, SecondaryButton, WaxSeal, cx, ui } from '@/components/ui';
import { cardPad } from '@/lib/art';
import { LAPTOP_MOTION, type LaptopGeo } from '@/lib/layout';
import { hostOf, stickerName } from '@/lib/sweet';
import { TapedPrint } from '@/components/photo';
import type { Receiver } from './useReceiver';

export type PreviewCtl = { toName: string; onReplay: () => void; onExit: () => void } | null;

const errCard = (r5: LaptopGeo['r5']): CSSProperties => ({ position: 'absolute', left: r5.left, top: r5.top, width: r5.w, boxSizing: 'border-box', background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 6, padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '6px 6px 0 rgba(31,42,68,.22)' });
const errTitle: CSSProperties = { margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: 44, lineHeight: 1.05 };
const errBody: CSSProperties = { font: "400 16px/1.5 'Work Sans',sans-serif", textWrap: 'pretty' } as CSSProperties;

export function LaptopReceiver({ g, rc, preview, onSendBack, onMakeNew }: {
  g: LaptopGeo; rc: Receiver; preview: PreviewCtl; onSendBack: () => void; onMakeNew: () => void;
}) {
  const { screen, sweet, replay } = rc;
  const { W, H, gs, rv, r5 } = g;
  const pv = preview ? 56 : 0;
  const MO = LAPTOP_MOTION;
  const recv = screen === 'r1' || screen === 'unwrap';
  const from = sweet?.from.trim() || 'Someone';

  // Placeholder candy for loading / error / not-found (no sweet data yet): the default wrap.
  const base = sweet ? { fab: sweet.paper, rib: sweet.ribbon, sticker: sweet.sticker, name: stickerName(sweet.to) } : { fab: 'cherry_print', rib: 'blue_stitch', sticker: 'butter_oval', name: 'you' };
  const stageTray = (candyStyle?: CSSProperties, pose: '' | 'melt' = '') => (
    <div style={{ position: 'absolute', left: gs.left, top: gs.top, width: 860, height: 900, transform: `scale(${gs.k})`, transformOrigin: '0 0' }}>
      <CandyInTray trayLeft={71.4} trayTop={1.7} trayScale={1.8391} candyLeft={110} candyTop={307} candyWidth={640} candy={{ ...base, pose }} candyStyle={candyStyle} />
    </div>
  );

  let body: ReactNode = null;
  if (screen === 'r0') {
    body = (
      <div style={{ position: 'absolute', left: 0, right: 0, top: Math.round(H * 0.3 + pv / 2), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <div style={{ width: Math.round(Math.min(460, W * 0.32)), animation: 'sw-rock 1.6s ease-in-out infinite', transformOrigin: '50% 80%' }}><Candy {...base} /></div>
        <div role="status" style={{ display: 'flex', alignItems: 'baseline', gap: 2, fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1 }}>
          Fetching your sweet<span style={{ animation: 'sw-dots 1.2s infinite' }}>.</span><span style={{ animation: 'sw-dots 1.2s .2s infinite' }}>.</span><span style={{ animation: 'sw-dots 1.2s .4s infinite' }}>.</span>
        </div>
      </div>
    );
  } else if (screen === 'r0err') {
    body = (
      <>
        {stageTray({ transform: 'rotate(-6deg)', opacity: 0.9 })}
        <div role="alert" style={errCard(r5)}>
          <h1 style={errTitle}>We couldn&apos;t reach your sweet</h1>
          <div style={errBody}>Something went wrong on the way. Check your connection and try again. The sweet hasn&apos;t gone anywhere.</div>
          <PrimaryButton variant="laptop" onClick={rc.load} style={{ marginTop: 6 }}>Try again</PrimaryButton>
        </div>
      </>
    );
  } else if (screen === 'r5') {
    body = (
      <>
        {stageTray(undefined, 'melt')}
        <div style={errCard(r5)}>
          <h1 style={errTitle}>This sweet melted</h1>
          <div style={errBody}>This link doesn&apos;t lead to a sweet anymore. It may have been mistyped, or the sender took it back.</div>
          <PrimaryButton variant="laptop" onClick={onMakeNew} style={{ marginTop: 6 }}>Make a new sweet</PrimaryButton>
        </div>
      </>
    );
  } else if (recv && sweet) {
    const isR1 = screen === 'r1';
    const tray: CSSProperties = { position: 'absolute', left: 316.6, top: -30.4, width: 390, height: 470, transform: 'scale(2.069)', transformOrigin: '0 0', pointerEvents: 'none' };
    body = (
      <>
        <div style={{ position: 'absolute', top: rv.pill, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 3 }}>
          <ArrivalPlaque variant="laptop" to={stickerName(sweet.to)} from={from} />
        </div>
        <div style={{ position: 'absolute', left: rv.left, top: rv.top, width: 1440, height: 900, transform: `scale(${rv.k})`, transformOrigin: '0 0' }}>
          <Sunburst left={20} top={-220} size={1400} />
          <div style={tray}><Tray part="back" /></div>
          <button type="button" data-btn={isR1 ? '1' : '0'} tabIndex={isR1 ? 0 : -1} onClick={rc.unwrap} title={isR1 ? 'Click to unwrap' : undefined} aria-label="Unwrap the sweet"
            className={cx(ui.reset, ui.candyBtn, !isR1 && ui.candyIdle)} style={{ left: 360, top: 313, width: 720 }}>
            <Candy {...base} pose={isR1 ? '' : 'anim'} dur={MO.dur} replay={isR1 ? 0 : replay} />
          </button>
          <div style={tray}><Tray part="front" /></div>
          {screen === 'unwrap' && (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1440, height: 900, pointerEvents: 'none' }}>
              <Confetti w={1440} h={900} cx={720} cy={500} n={110} seed={5} min={150} spread={640} stars={22} anim delay={MO.delay} dur={MO.cdur} replay={replay} />
            </div>
          )}
        </div>
        {isR1 && (
          <div style={{ position: 'absolute', top: rv.tap, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <UnwrapButton variant="laptop" onClick={rc.unwrap} />
          </div>
        )}
      </>
    );
  } else if (screen === 'r4' && sweet) {
    body = <Reveal g={g} rc={rc} pv={pv} onSendBack={onSendBack} />;
  }

  return (
    <>
      {body}
      {preview && (screen !== 'r5') && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 56, zIndex: 8, boxSizing: 'border-box', padding: '0 20px 0 28px', background: '#783E19', color: '#FBF0DA', display: 'flex', alignItems: 'center', gap: 16 }}>
          <EyeIcon />
          <span style={{ font: "700 11px/1 'Work Sans',sans-serif", letterSpacing: '.18em' }}>PREVIEW</span>
          <span style={{ flex: 1, minWidth: 0, font: "400 14px/1.3 'Work Sans',sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>This is what {preview.toName} will see. Nothing has been sent.</span>
          <button type="button" data-btn="1" onClick={preview.onReplay} className={cx(ui.reset, ui.pvLink)}>Replay</button>
          <button type="button" data-btn="1" onClick={preview.onExit} className={cx(ui.reset, ui.pvBack)}>← Back to your sweet</button>
        </div>
      )}
      {(recv || screen === 'r4' || screen === 'r0') && <MuteButton variant="laptop" muted={rc.muted} onToggle={rc.toggleMute} top={28 + pv} />}
    </>
  );
}

/** R4: the card rises to the centre and the five wrapper pieces land around it (reveal 5b). */
function Reveal({ g, rc, pv, onSendBack }: { g: LaptopGeo; rc: Receiver; pv: number; onSendBack: () => void }) {
  const sweet = rc.sweet!;
  const { W, H } = g;
  const card = sweet.card, heart = card === 'card_1', extra = sweet.extra.type;
  const len = sweet.note.length, tName = stickerName(sweet.to), from = sweet.from.trim() || 'Someone';
  const linkIn = extra === 'link' && !heart, linkOut = extra === 'link' && heart;
  const url = sweet.extra.type === 'link' ? sweet.extra.url : '';

  const w = heart ? 560 : 640;
  let h: number;
  if (heart) h = 540;
  else { const p = cardPad(card, w, 420), cpl = Math.max(12, Math.floor((w - p[1] - p[3]) / 15)), lines = Math.max(2, Math.ceil(len / cpl)); h = Math.max(360, Math.round(p[0] + p[2] + 30 + lines * 44 + 60 + (linkIn ? 96 : 0))); }
  const btnH = 56 + (linkOut ? 68 : 0), total = h + 44 + btnH, top = Math.max(40 + pv, Math.round((H - total + pv) / 2));
  const left = extra === 'photo' ? Math.round((W - w - 290) / 2) : extra === 'iou' ? Math.round((W - w - 300) / 2) : Math.round((W - w) / 2);
  const r4 = { w, h, top, left, pad: cardPad(card, w, h).map((v) => Math.round(v) + 'px').join(' '), align: (heart ? 'center' : 'left') as CSSProperties['textAlign'], fromAlign: heart ? 'center' : 'flex-end', fs: heart ? 26 : len <= 120 ? 34 : 28, from: heart ? 28 : 36, btnTop: top + h + 44, iouLeft: left + w - 60, iouTop: top + 80, photoTop: top - 20, photoLeft: left + w - 16 };

  // Pieces fill the gaps either side of the card.
  const k = Math.min(1.1, Math.max(0.72, W / 1440)), o = { fab: sweet.paper, rib: sweet.ribbon, sticker: sweet.sticker, name: tName };
  const Lg = r4.left, Rs = extra === 'photo' ? r4.photoLeft + 320 : extra === 'iou' ? r4.iouLeft + 350 : r4.left + r4.w + (extra === 'link' ? 50 : 0), Rg = W - Rs;
  const pieces: { key: string; el: ReactNode; w: number; h: number; left: number; top: number; rot: number; delay: string }[] = [];
  const fit = (gap: number, bw: number, bh: number) => { const pw = Math.min(bw * k, gap - 28); return pw < 96 ? null : { w: Math.round(pw), h: Math.round((bh * pw) / bw) }; };
  const place = (key: string, el: ReactNode, side: 0 | 1, bw: number, bh: number, ty: number, rot: number, d: number) => {
    const gap = side ? Rg : Lg, f = fit(gap, bw, bh); if (!f) return;
    const x0 = side ? Rs : 0;
    pieces.push({ key, el, w: f.w, h: f.h, left: Math.round(x0 + (gap - f.w) / 2), top: Math.round(ty), rot, delay: (0.15 + d).toFixed(2) });
  };
  place('bowL', <CandyPiece {...o} only="bowL" />, 0, 260, 150, pv + 0.07 * H, -24, 0);
  place('endR', <CandyPiece {...o} only="endR" />, 1, 240, 160, pv + 100, 16, 0.08);
  place('endL', <CandyPiece {...o} only="endL" />, 0, 250, 165, 0.66 * H, -8, 0.14);
  place('bowR', <CandyPiece {...o} only="bowR" />, 1, 250, 145, 0.7 * H, 28, 0.2);
  const right = Rg >= Lg;
  place('stk', <Sticker k={sweet.sticker} name={tName} />, right ? 1 : 0, 200, 146, 0.4 * H + pv / 2, right ? 9 : -9, 0.3);

  return (
    <>
      {pieces.map((p) => (
        <div key={p.key} aria-hidden style={{ position: 'absolute', left: p.left, top: p.top, width: p.w, height: p.h, transform: `rotate(${p.rot}deg)`, animation: `sw-land .75s ${p.delay}s cubic-bezier(.2,1.35,.4,1) both` }}>
          <div className={ui.piece}>{p.el}</div>
        </div>
      ))}
      <div style={{ position: 'absolute', left: r4.left, top: r4.top, width: r4.w, height: r4.h, animation: 'sw-rise .6s cubic-bezier(.2,.9,.3,1) both' }}>
        <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-1.2deg)', filter: 'drop-shadow(8px 8px 0 rgba(31,42,68,.28))' }}>
          <div style={{ position: 'absolute', inset: 0 }}><NoteCard style={card} w={w} h={h} /></div>
          <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: r4.pad, textAlign: r4.align, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ font: "700 15px/1 'Work Sans',sans-serif", letterSpacing: '.2em', textTransform: 'uppercase' }}>to {sweet.to}</div>
            <div style={{ flex: 1, fontFamily: "'IM Fell DW Pica',serif", fontSize: r4.fs, lineHeight: 1.3, textWrap: 'pretty', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' } as CSSProperties}>{sweet.note}</div>
            {linkIn && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <PrimaryLink variant="laptop" href={url} style={{ width: 340 }}>Open your gift →</PrimaryLink>
                <div style={{ font: "500 13px/1 'Work Sans',sans-serif" }}>{hostOf(url)}</div>
              </div>
            )}
            <div style={{ alignSelf: r4.fromAlign, fontFamily: "'La Belle Aurore',cursive", fontSize: r4.from, lineHeight: 1.2 }}>from {sweet.from}</div>
          </div>
        </div>
        {extra === 'link' && <div style={{ position: 'absolute', right: -40, top: -44, pointerEvents: 'none' }}><WaxSeal size={120} /></div>}
      </div>
      {sweet.extra.type === 'iou' && (
        <div style={{ position: 'absolute', left: r4.iouLeft, top: r4.iouTop, width: 340, transform: 'rotate(5deg)', filter: 'drop-shadow(0 6px 6px rgba(90,42,16,.28))', animation: 'sw-rise .6s .15s cubic-bezier(.2,.9,.3,1) both' }}>
          <IouCoupon text={sweet.extra.text} from={from} size="reveal" />
        </div>
      )}
      {sweet.extra.type === 'photo' && (
        <TapedPrint size="laptopReveal" src={sweet.extra.imageUrl} caption={sweet.extra.caption}
          style={{ position: 'absolute', left: r4.photoLeft, top: r4.photoTop, rotate: '5deg', animation: 'sw-rise .6s .15s cubic-bezier(.2,.9,.3,1) both' }} />
      )}
      <div style={{ position: 'absolute', left: Math.round((W - 320) / 2), top: r4.btnTop, width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {linkOut && <PrimaryLink variant="laptop" href={url}>Open your gift →</PrimaryLink>}
        {extra !== 'link'
          ? <PrimaryButton variant="laptop" onClick={onSendBack}>Send a sweet back</PrimaryButton>
          : <SecondaryButton variant="laptop" onClick={onSendBack}>Send a sweet back</SecondaryButton>}
      </div>
    </>
  );
}
