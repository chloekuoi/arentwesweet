'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Candy, CandyInTray, CandyPiece, Confetti, NoteCard, Sticker } from '@/components/art';
import { ArrivalPlaque, Sunburst, UnwrapButton, EyeIcon, IouCoupon, MuteButton, PrimaryButton, PrimaryLink, SecondaryButton, WaxSeal, cx, ui } from '@/components/ui';
import { cardPad } from '@/lib/art';
import { PHONE_MOTION, type PhoneGeo } from '@/lib/layout';
import { hostOf, stickerName } from '@/lib/sweet';
import type { PreviewCtl } from './LaptopReceiver';
import type { Receiver } from './useReceiver';

const errCard = (top: number): CSSProperties => ({ position: 'absolute', left: 20, right: 20, top, background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 6, padding: '26px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14, zIndex: 5, boxShadow: '6px 6px 0 rgba(31,42,68,.22)' });
const errBody: CSSProperties = { font: "400 15px/1.5 'Work Sans',sans-serif", textWrap: 'pretty' } as CSSProperties;

/** Instagram / TikTok / Facebook in-app browsers. */
function inAppName(): string {
  if (typeof navigator === 'undefined') return '';
  const ua = navigator.userAgent;
  return /Instagram/i.test(ua) ? 'Instagram' : /musical_ly|TikTok|BytedanceWebview/i.test(ua) ? 'TikTok' : /FBAN|FBAV/i.test(ua) ? 'Facebook' : '';
}
const NUDGE_KEY = 'sweet.nudgeSeen';

export function PhoneReceiver({ L, rc, preview, onSendBack, onMakeNew }: {
  L: PhoneGeo; rc: Receiver; preview: PreviewCtl; onSendBack: () => void; onMakeNew: () => void;
}) {
  const { screen, sweet, replay } = rc;
  const { ch, dy, tight } = L;
  const pv = preview ? 44 : 0;
  const recv = ['r1', 'unwrap', 'r4', 'r5', 'r0err'].includes(screen);
  const isR4 = screen === 'r4';

  // The Open in Safari nudge shows once per device, on arrival.
  const [app, setApp] = useState('');
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    const a = inAppName(); setApp(a);
    let seen = false; try { seen = localStorage.getItem(NUDGE_KEY) === '1'; } catch { /* ignore */ }
    setNudge(!!a && !seen && !preview);
  }, [preview]);
  const hideNudge = () => { setNudge(false); try { localStorage.setItem(NUDGE_KEY, '1'); } catch { /* ignore */ } };

  const base = sweet ? { fab: sweet.paper, rib: sweet.ribbon, sticker: sweet.sticker, name: stickerName(sweet.to) } : { fab: 'cherry_print', rib: 'blue_stitch', sticker: 'butter_oval', name: 'you' };
  const from = sweet?.from.trim() || 'Someone';
  const pose = screen === 'unwrap' ? 'anim' : screen === 'r5' ? 'melt' : '';
  const recvY = Math.round(dy * (screen === 'r5' || screen === 'r0err' ? 0.25 : 0.5));
  const muteTop = 54 + pv;

  let body: ReactNode = null;
  if (screen === 'r0') {
    body = (
      <div style={{ position: 'absolute', left: 0, right: 0, top: Math.round(ch * 0.34), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <div style={{ width: 250, animation: 'sw-rock-phone 1.6s ease-in-out infinite', transformOrigin: '50% 80%' }}><Candy {...base} /></div>
        <div role="status" style={{ display: 'flex', alignItems: 'baseline', fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: 24, lineHeight: 1 }}>
          Fetching your sweet<span style={{ animation: 'sw-dots 1.2s infinite' }}>.</span><span style={{ animation: 'sw-dots 1.2s .2s infinite' }}>.</span><span style={{ animation: 'sw-dots 1.2s .4s infinite' }}>.</span>
        </div>
      </div>
    );
  } else if (recv) {
    body = (
      <div style={{ position: 'absolute', inset: 0 }}>
        {!isR4 && (
          <div style={{ position: 'absolute', left: 0, top: recvY, width: 390, height: 844 }}>
            {(screen === 'r1' || screen === 'unwrap') && <Sunburst left={-185} top={90} size={760} />}
            <CandyInTray trayLeft={0} trayTop={219} trayScale={1} candyLeft={21} candyTop={385} candyWidth={348}
              candy={{ ...base, pose, dur: PHONE_MOTION.dur, replay: pose === 'anim' ? replay : 0 }} candyStyle={{ cursor: screen === 'r1' ? 'pointer' : 'default' }} />
            {screen === 'r1' && <button type="button" aria-label="Unwrap the sweet" tabIndex={-1} onClick={rc.unwrap} className={ui.reset} style={{ position: 'absolute', left: 21, top: 385, width: 348, height: 194, cursor: 'pointer' }} />}
            {screen === 'unwrap' && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <Confetti w={390} h={844} cx={195} cy={360} n={44} seed={5} min={46} spread={210} stars={9} anim delay={PHONE_MOTION.delay} dur={PHONE_MOTION.cdur} replay={replay} />
              </div>
            )}
          </div>
        )}
        {(screen === 'r1' || screen === 'unwrap') && sweet && (
          <div style={{ position: 'absolute', top: 104 + pv, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 3 }}>
            <ArrivalPlaque variant="phone" to={stickerName(sweet.to)} from={from} />
          </div>
        )}
        {screen === 'r1' && (
          <div style={{ position: 'absolute', top: 600 + Math.round(dy * 0.5), left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <UnwrapButton variant="phone" onClick={rc.unwrap} />
          </div>
        )}
        {isR4 && sweet && <PhoneReveal L={L} rc={rc} pv={pv} muteTop={muteTop} onSendBack={onSendBack} />}
        {screen === 'r5' && (
          <div style={errCard(112 + pv)}>
            <h1 style={{ margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: 34, lineHeight: 1.05 }}>This sweet melted</h1>
            <div style={errBody}>This link doesn&apos;t lead to a sweet anymore. It may have been mistyped, or the sender took it back.</div>
            <PrimaryButton variant="phone" onClick={onMakeNew} style={{ marginTop: 4 }}>Make a new sweet</PrimaryButton>
          </div>
        )}
        {screen === 'r0err' && (
          <div role="alert" style={errCard(112 + pv)}>
            <h1 style={{ margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: 32, lineHeight: 1.05 }}>We couldn&apos;t reach your sweet</h1>
            <div style={errBody}>Something went wrong on the way. Check your connection and try again. The sweet hasn&apos;t gone anywhere.</div>
            <PrimaryButton variant="phone" onClick={rc.load} style={{ marginTop: 4 }}>Try again</PrimaryButton>
          </div>
        )}
      </div>
    );
  }
  void tight;

  return (
    <>
      {body}
      {(screen === 'r1' || screen === 'unwrap' || isR4) && <MuteButton variant="phone" muted={rc.muted} onToggle={rc.toggleMute} top={muteTop} />}
      {nudge && screen === 'r1' && (
        <div role="dialog" aria-label="Open in Safari" style={{ position: 'absolute', right: 10, top: 10 + pv, width: 292, zIndex: 14, filter: 'drop-shadow(4px 5px 0 rgba(31,42,68,.22))', animation: 'sw-rise .45s cubic-bezier(.2,.9,.3,1) both' }}>
          <svg width="22" height="12" viewBox="0 0 22 12" style={{ position: 'absolute', right: 10, top: -10, display: 'block' }} aria-hidden><path d="M1,12 L11,1.5 L21,12" fill="#FBF0DA" stroke="#783E19" strokeWidth="2" strokeLinejoin="round" /></svg>
          <div style={{ background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 8, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ fontFamily: "'IM Fell DW Pica',serif", fontSize: 20, lineHeight: 1.1 }}>You&apos;re inside {app}</div>
            <div style={{ font: "400 13px/1.45 'Work Sans',sans-serif", textWrap: 'pretty' } as CSSProperties}>The sweet unwraps best in Safari, with sound and copying that work. Tap <b style={{ fontWeight: 700, letterSpacing: '.1em' }}>•••</b> above, then <b style={{ fontWeight: 600 }}>Open in browser</b>.</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, alignItems: 'center', marginTop: 2 }}>
              <button type="button" onClick={hideNudge} className={ui.reset} style={{ font: "600 13px/1 'Work Sans',sans-serif", textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', padding: '8px 4px' }}>Stay here</button>
              <button type="button" onClick={hideNudge} className={ui.reset} style={{ height: 36, display: 'flex', alignItems: 'center', padding: '0 16px', background: '#F3E08A', border: '2px solid #783E19', borderRadius: 999, boxSizing: 'border-box', boxShadow: '2px 3px 0 #783E19', fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: 17, lineHeight: 1, cursor: 'pointer' }}>Got it</button>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, zIndex: 12, boxSizing: 'border-box', padding: '0 10px 0 18px', background: '#783E19', color: '#FBF0DA', display: 'flex', alignItems: 'center', gap: 10 }}>
          <EyeIcon w={20} h={13} />
          <span style={{ flex: 1, minWidth: 0, font: "500 13px/1.2 'Work Sans',sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><b style={{ fontWeight: 700, letterSpacing: '.14em', fontSize: 10.5 }}>PREVIEW</b>{'  '}as {preview.toName} sees it</span>
          <button type="button" onClick={preview.onReplay} className={cx(ui.reset, ui.pPvLink)}>Replay</button>
          <button type="button" onClick={preview.onExit} className={cx(ui.reset, ui.pPvDone)}>Done</button>
        </div>
      )}
    </>
  );
}

/** Phone R4: card (and IOU above it), pieces below the card, Send a sweet back pinned at the bottom. */
function PhoneReveal({ L, rc, pv, muteTop, onSendBack }: { L: PhoneGeo; rc: Receiver; pv: number; muteTop: number; onSendBack: () => void }) {
  const sweet = rc.sweet!;
  const { ch, tight } = L;
  const card = sweet.card, heart = card === 'card_1', extra = sweet.extra.type;
  const len = sweet.note.length, tName = stickerName(sweet.to), from = sweet.from.trim() || 'Someone';
  const url = sweet.extra.type === 'link' ? sweet.extra.url : '';
  const r4Top = (tight ? 100 : 118) + pv;

  let r4H: number;
  if (heart) { const lines = Math.max(2, Math.ceil(len / 22)); r4H = Math.min(380, Math.max(310, Math.round((25 + 40 + lines * 23) / 0.46))); }
  else { const p = cardPad(card, 346, 300), cpl = Math.max(10, Math.floor((346 - p[1] - p[3]) / 11.6)), lines = Math.max(2, Math.ceil(len / cpl)); r4H = Math.round(p[0] + p[2] + 25 + lines * 31 + 48 + (extra === 'link' ? 88 : 0)); }
  const r4Pad = cardPad(card, 346, r4H).map((v) => Math.round(v) + 'px').join(' ');
  let r4k = 1;
  const avail = ch - 100 - r4Top, tot = (extra === 'iou' ? 128 : 0) + r4H + (extra === 'link' && heart ? 80 : 0);
  if (tot > avail) r4k = +(avail / tot).toFixed(3);

  // Wrapper pieces below the card (and below the Open-your-gift button under a heart card); with little room, a single row, or peeking from the card's corners.
  const o = { fab: sweet.paper, rib: sweet.ribbon, sticker: sweet.sticker, name: tName };
  const part = (k: 'bowL' | 'bowR' | 'endL' | 'endR') => <CandyPiece {...o} only={k} />;
  const stk = <Sticker k={sweet.sticker} name={tName} />;
  const cardTop = r4Top + (extra === 'iou' ? 128 : 0) * r4k, cardBottom = cardTop + r4H * r4k, bt = cardBottom + (extra === 'link' && heart ? 80 * r4k : 0) + 14, bh = ch - 100 - bt;
  const pieces: { key: string; el: ReactNode; left: number; top: number; w: number; rot: number; delay: string }[] = [];
  const P = (key: string, el: ReactNode, x: number, y: number, w: number, rot: number, d: number) => pieces.push({ key, el, left: Math.round(x), top: Math.round(y), w: Math.round(w), rot, delay: (0.2 + d).toFixed(2) });
  if (bh >= 240) { const f = Math.min(1, (bh - 120) / 135), y2 = bt + Math.min(126, bh - 122); P('bowL', part('bowL'), 8, bt, 124, -18, 0); P('endR', part('endR'), 252, bt + 6, 120, 14, 0.08); P('stk', stk, 140, bt + 60 * f, 108, 6, 0.3); P('endL', part('endL'), 2, y2, 116, -8, 0.14); P('bowR', part('bowR'), 262, y2 + 4, 112, 26, 0.2); }
  else if (bh >= 110) { P('bowL', part('bowL'), 18, bt, 104, -18, 0); P('stk', stk, 146, bt + 4, 98, 6, 0.2); P('bowR', part('bowR'), 268, bt, 104, 24, 0.1); }
  else { P('bowL', part('bowL'), -26, cardTop - 40, 110, -24, 0); if (cardTop - 40 > muteTop + 50) P('bowR', part('bowR'), 300, cardTop - 40, 110, 24, 0.1); }

  const openGift = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <PrimaryLink variant="phone" href={url} style={{ gap: 10 }}>Open your gift →</PrimaryLink>
      <div style={{ font: "500 11.5px/1 'Work Sans',sans-serif", textAlign: 'center' }}>{hostOf(url)}</div>
    </div>
  );

  return (
    <>
      {pieces.map((p) => (
        <div key={p.key} aria-hidden style={{ position: 'absolute', left: p.left, top: p.top, width: p.w, transform: `rotate(${p.rot}deg)`, zIndex: 4, animation: `sw-land-phone .7s ${p.delay}s cubic-bezier(.2,1.35,.4,1) both`, filter: 'drop-shadow(3px 4px 0 rgba(31,42,68,.16))' }}>{p.el}</div>
      ))}
      <div style={{ position: 'absolute', left: 22, right: 22, top: r4Top, display: 'flex', flexDirection: 'column', gap: 18, zIndex: 5, scale: r4k, transformOrigin: '50% 0', animation: 'sw-rise .6s cubic-bezier(.2,.9,.3,1) both' } as CSSProperties}>
        {sweet.extra.type === 'iou' && (
          <div style={{ position: 'relative', margin: '10px 12px 0', transform: 'rotate(1.5deg)', filter: 'drop-shadow(0 3px 3px rgba(90,42,16,.28))' }}>
            <IouCoupon text={sweet.extra.text} from={from} size="pReveal" />
          </div>
        )}
        <div style={{ position: 'relative', height: r4H, transform: 'rotate(-1.2deg)', filter: 'drop-shadow(6px 6px 0 rgba(31,42,68,.28))' }}>
          <div style={{ position: 'absolute', inset: 0 }}><NoteCard style={card} w={346} h={r4H} /></div>
          {extra === 'link' && (
            <div style={{ position: 'absolute', left: -14, top: -26, zIndex: 2, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, filter: 'url(#sealwob)' }}><WaxSeal size={74} /></div>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: r4Pad, textAlign: heart ? 'center' : 'left', display: 'flex', flexDirection: 'column', gap: heart ? 10 : 14 }}>
            <div style={{ font: "700 11px/1 'Work Sans',sans-serif", letterSpacing: '.2em', textTransform: 'uppercase' }}>to {sweet.to}</div>
            <div style={{ flex: 1, fontFamily: "'IM Fell DW Pica',serif", fontSize: heart ? (tight ? 16 : 18) : tight ? 21 : 24, lineHeight: 1.35, textWrap: 'pretty', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' } as CSSProperties}>{sweet.note}</div>
            {extra === 'link' && !heart && openGift}
            <div style={{ alignSelf: heart ? 'center' : 'flex-end', fontFamily: "'La Belle Aurore',cursive", fontSize: heart ? 19 : 24, lineHeight: 1 }}>from {sweet.from}</div>
          </div>
        </div>
        {extra === 'link' && heart && openGift}
      </div>
      <div style={{ position: 'absolute', left: 22, right: 22, bottom: 30, zIndex: 5 }}>
        {extra !== 'link'
          ? <PrimaryButton variant="phone" onClick={onSendBack}>Send a sweet back</PrimaryButton>
          : <SecondaryButton variant="phone" onClick={onSendBack}>Send a sweet back</SecondaryButton>}
      </div>
    </>
  );
}
