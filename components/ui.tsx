'use client';
import type { CSSProperties, ReactNode, Ref } from 'react';
import s from '@/styles/ui.module.css';

export type Variant = 'laptop' | 'phone';
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

type BtnProps = { children: ReactNode; onClick?: () => void; variant: Variant; style?: CSSProperties; busy?: boolean; className?: string };

export function PrimaryButton({ children, onClick, variant, style, busy }: BtnProps) {
  return (
    <button type="button" data-btn="1" aria-busy={busy || undefined} onClick={onClick}
      className={cx(s.reset, s.primary, s[variant], busy && s.busy)} style={style}>{children}</button>
  );
}

export function PrimaryLink({ children, href, variant, style }: { children: ReactNode; href: string; variant: Variant; style?: CSSProperties }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cx(s.primary, s[variant])} style={style}>{children}</a>;
}

export function SecondaryButton({ children, onClick, variant, style }: BtnProps) {
  return <button type="button" data-btn="1" onClick={onClick} className={cx(s.reset, s.secondary, s[variant])} style={style}>{children}</button>;
}

export function TextLink({ children, onClick, variant, style }: BtnProps) {
  return <button type="button" data-btn="1" onClick={onClick} className={cx(s.reset, variant === 'phone' ? s.phoneLink : s.textLink)} style={style}>{children}</button>;
}

/** Tiny wrapped-candy glyph used by the step bar and the S4 options. */
export function MiniCandy({ fill, w, h, sw = 1.6, seams = true }: { fill: string; w: number; h: number; sw?: number; seams?: boolean }) {
  return (
    <svg width={w} height={h} viewBox="0 0 46 24" style={{ overflow: 'visible', flex: 'none' }} aria-hidden>
      <path d="M12,12 L2,4 Q0,12 2,20Z M34,12 L44,4 Q46,12 44,20Z" fill={fill} stroke="#783E19" strokeWidth={sw} strokeLinejoin="round" />
      <rect x="10" y="3" width="26" height="18" rx="9" fill={fill} stroke="#783E19" strokeWidth={sw} />
      {seams && <path d="M17,4 V20 M29,4 V20" stroke="#783E19" strokeOpacity=".35" strokeWidth="1" />}
    </svg>
  );
}

const STEPS = ['Wrap', 'Note', 'Extra', 'Send'];
/** 4 tiny candies spread across the width. Finished steps can be clicked on laptop. */
export function StepBar({ step, onGo, variant }: { step: number; onGo?: (i: number) => void; variant: Variant }) {
  return (
    <nav aria-label="Steps" style={{ display: 'flex', alignItems: 'flex-start' }}>
      {STEPS.map((label, i) => {
        const k = i + 1, on = k === step, done = k < step, clickable = done && variant === 'laptop' && !!onGo;
        const inner = (
          <>
            <MiniCandy fill={on ? '#F3E08A' : done ? '#EBA3AE' : '#FBF0DA'} w={on ? 46 : 34} h={on ? 24 : 18} />
            <span style={{ font: on ? "700 9.5px/1 'Work Sans',sans-serif" : "500 9px/1 'Work Sans',sans-serif", letterSpacing: '.12em', textTransform: 'uppercase' }}>{label}</span>
          </>
        );
        return (
          <div key={label} style={{ flex: i ? '1 1 0' : 'none', display: 'flex', alignItems: 'flex-start' }}>
            {i > 0 && <div style={{ flex: 1, margin: variant === 'laptop' ? '15px 8px 0' : '15px 4px 0', borderTop: '1.5px dashed #783E19', opacity: .6 }} />}
            {clickable
              ? <button type="button" data-btn="1" title={'Back to ' + label} onClick={() => onGo!(k)} className={cx(s.reset, s.step, s.stepDone)}>{inner}</button>
              : <div className={s.step} aria-current={on ? 'step' : undefined}>{inner}</div>}
          </div>
        );
      })}
    </nav>
  );
}

export function ErrorDot({ size = 18 }: { size?: number }) {
  return <span aria-hidden style={{ flex: 'none', width: size, height: size, borderRadius: '50%', background: '#C8443F', color: '#FBF0DA', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 ${size - 6}px/1 'Work Sans',sans-serif` }}>!</span>;
}

export function LockIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden><rect x="1" y="6" width="10" height="7.5" rx="1.5" fill="#783E19" /><path d="M3.3,6 V4.2 a2.7,2.7 0 0 1 5.4,0 V6" fill="none" stroke="#783E19" strokeWidth="1.6" /></svg>
  );
}
export function PencilIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#783E19" strokeWidth="1.6" strokeLinejoin="round" aria-hidden><path d="M3,13 L3.6,10.2 L11,2.8 L13.2,5 L5.8,12.4Z M9.6,4.2 L11.8,6.4" /></svg>;
}
export function EyeIcon({ w = 22, h = 14 }: { w?: number; h?: number }) {
  return <svg width={w} height={h} viewBox="0 0 22 14" fill="none" stroke="#FBF0DA" strokeWidth="1.6" aria-hidden><path d="M1,7 Q11,-3 21,7 Q11,17 1,7Z" /><circle cx="11" cy="7" r="2.6" fill="#FBF0DA" /></svg>;
}
export function LinkGlyph({ w, h }: { w: number; h: number }) {
  return <svg width={w} height={h} viewBox="0 0 26 16" aria-hidden><g transform="translate(13,8) rotate(-30)" fill="none" stroke="#783E19" strokeWidth="2"><rect x="-11" y="-4" width="12" height="8" rx="4" /><rect x="-1" y="-4" width="12" height="8" rx="4" /></g></svg>;
}
export function SpeakerIcon({ muted, size }: { muted: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="#783E19" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3,8 H6 L10.5,4 V16 L6,12 H3Z" fill="#783E19" />
      <path d={muted ? 'M13.5,7.5 L18,12.5 M18,7.5 L13.5,12.5' : 'M13.5,7.5 Q15.5,10 13.5,12.5 M15.8,5.5 Q19.2,10 15.8,14.5'} />
    </svg>
  );
}

export function MuteButton({ muted, onToggle, top, variant }: { muted: boolean; onToggle: () => void; top: number; variant: Variant }) {
  const laptop = variant === 'laptop';
  return (
    <button type="button" data-btn="1" onClick={onToggle} style={{ top }} className={cx(s.reset, laptop ? s.mute : s.pMute)}
      aria-pressed={muted} aria-label={muted ? 'Sound off' : 'Sound on'}
      title={laptop ? (muted ? 'Sound off · remembered on this device (M)' : 'Sound on (M)') : undefined}>
      <SpeakerIcon muted={muted} size={laptop ? 22 : 20} />
    </button>
  );
}

/** Baby-blue wax seal reading OPEN ME. `size` is 128 (laptop stage), 120 (laptop R4) or 74 (phone). */
export function WaxSeal({ size }: { size: 128 | 120 | 74 }) {
  const small = size === 74;
  const shadow = small
    ? 'inset 0 0 0 5px #A7C3E8,inset 0 0 0 6.5px #FBF0DA,inset 0 0 0 8px #783E19,0 4px 4px rgba(90,42,16,.3)'
    : `inset 0 0 0 8px #A7C3E8,inset 0 0 0 10.5px #FBF0DA,inset 0 0 0 13px #783E19,0 ${size === 128 ? 7 : 6}px ${size === 128 ? 7 : 6}px rgba(90,42,16,.3)`;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#A7C3E8', border: `${small ? 2 : 3}px solid #783E19`, boxSizing: 'border-box', boxShadow: shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: small ? 2 : 4, transform: 'rotate(-8deg)' }}>
      {small ? <LinkGlyph w={26} h={16} /> : <LinkGlyph w={size === 128 ? 44 : 42} h={size === 128 ? 27 : 26} />}
      <span style={{ font: `700 ${small ? 6.5 : size === 128 ? 11 : 10.5}px/1 'Work Sans',sans-serif`, letterSpacing: '.18em' }}>OPEN ME</span>
    </div>
  );
}

/** SVG filter used to wobble the phone seal like the ink art. Render once per phone tree. */
export function SealWobbleDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <filter id="sealwob" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves={2} seed={7} result="t" /><feDisplacementMap in="SourceGraphic" in2="t" scale="2.4" xChannelSelector="R" yChannelSelector="G" /></filter>
    </svg>
  );
}

/** Butter IOU coupon with scalloped top/bottom and a gold paper clip. */
export function IouCoupon({ text, from, size }: { text: string; from?: string; size: 'stage' | 'reveal' | 'pStage' | 'pReveal' }) {
  const S = {
    stage: { r: 6, rr: 5.6, tile: 15, minH: 124, pad: '22px 20px 22px 40px', gap: 9, lbl: 11, fs: 28, sub: 0, ol: 1.5, clip: [30, 66, 8, -28] },
    reveal: { r: 7, rr: 6.6, tile: 18, minH: 170, pad: '26px 24px 26px 44px', gap: 11, lbl: 12, fs: 34, sub: 14, ol: 1.5, clip: [34, 76, 10, -32] },
    pStage: { r: 4, rr: 3.6, tile: 10, minH: 64, pad: '12px 10px 12px 22px', gap: 5, lbl: 7, fs: 14, sub: 0, ol: 1, clip: [18, 40, 4, -16] },
    pReveal: { r: 6, rr: 5.6, tile: 15, minH: 110, pad: '20px 22px 20px 30px', gap: 9, lbl: 10, fs: 26, sub: 12, ol: 1, clip: [24, 54, 8, -22] },
  }[size];
  const m = `radial-gradient(circle ${S.r}px at 50% 100%,transparent ${S.rr}px,#000 ${S.r}px) bottom/${S.tile}px 51% repeat-x,radial-gradient(circle ${S.r}px at 50% 0,transparent ${S.rr}px,#000 ${S.r}px) top/${S.tile}px 51% repeat-x`;
  const o = S.ol;
  return (
    <>
      <div style={{ filter: `drop-shadow(${o}px 0 0 #783E19) drop-shadow(-${o}px 0 0 #783E19) drop-shadow(0 ${o}px 0 #783E19) drop-shadow(0 -${o}px 0 #783E19)` }}>
        <div style={{ minHeight: S.minH, background: '#F3E08A', boxSizing: 'border-box', padding: S.pad, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S.gap, textAlign: 'center', WebkitMask: m, mask: m }}>
          <span style={{ font: `700 ${S.lbl}px/1 'Work Sans',sans-serif`, letterSpacing: '.2em' }}>IOU · GOOD FOR ONE</span>
          <span style={{ fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: S.fs, lineHeight: 1.15, textWrap: 'balance', overflowWrap: 'anywhere' } as CSSProperties}>{text}</span>
          {S.sub > 0 && <span style={{ font: `500 ${S.sub}px/1 'Work Sans',sans-serif` }}>Redeem with {from}, any time</span>}
        </div>
      </div>
      <svg width={S.clip[0]} height={S.clip[1]} viewBox="0 0 18 40" style={{ position: 'absolute', left: S.clip[2], top: S.clip[3], overflow: 'visible' }} aria-hidden>
        <path d="M5,30 V7 a4,4 0 0 1 8,0 V33 a6,6 0 0 1 -12,0 V12" fill="none" stroke="#783E19" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M5,30 V7 a4,4 0 0 1 8,0 V33 a6,6 0 0 1 -12,0 V12" fill="none" stroke="#C9A44A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </>
  );
}

export function Field({ label, count, children, gap = 8, countSize = 11, style }: { label: string; count?: string; children: ReactNode; gap?: number; countSize?: number; style?: CSSProperties }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap, position: 'relative', minWidth: 0, ...style }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', font: "600 10.5px/1 'Work Sans',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase' }}>
        <span>{label}</span>
        {count && <span style={{ fontWeight: 500, letterSpacing: 0, color: '#6B4A36', fontSize: countSize, fontVariantNumeric: 'tabular-nums' }}>{count}</span>}
      </span>
      {children}
    </label>
  );
}

/** S1 "shop label": "Sweet" in script between two short rules. */
export function LabelWordmark({ variant }: { variant: Variant }) {
  const laptop = variant === 'laptop', rule = <div style={{ width: laptop ? 40 : 30, height: 1.5, background: '#783E19' }} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      {rule}<div style={{ fontFamily: "'La Belle Aurore',cursive", fontSize: laptop ? 24 : 21, lineHeight: 1 }}>Sweet</div>{rule}
    </div>
  );
}

/** R1 butter-and-cream sunburst behind the sweet, fading out with a radial mask. */
export function Sunburst({ left, top, size }: { left: number; top: number; size: number }) {
  const mask = 'radial-gradient(circle,#000 0 30%,rgba(0,0,0,0) 62%)';
  return <div aria-hidden style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg,#F7E8A4 0 5deg,#FCF7EF 5deg 10deg)', WebkitMask: mask, mask, pointerEvents: 'none' }} />;
}

/** R1 plaque: "Hooray, {recipient}!" over "{sender} sent you a sweet". */
export function ArrivalPlaque({ to, from, variant }: { to: string; from: string; variant: Variant }) {
  const laptop = variant === 'laptop';
  const line: CSSProperties = { maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  return (
    <div style={{ background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 999, padding: laptop ? 7 : 5, boxShadow: laptop ? '5px 5px 0 rgba(31,42,68,.2)' : '4px 4px 0 rgba(31,42,68,.2)', maxWidth: laptop ? 900 : 350, boxSizing: 'border-box', minWidth: 0 }}>
      <div style={{ border: '1.5px dashed #783E19', borderRadius: 999, padding: laptop ? '16px 56px 20px' : '9px 22px 11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: laptop ? 6 : 4, minWidth: 0 }}>
        <div style={{ ...line, fontFamily: "'La Belle Aurore',cursive", fontSize: laptop ? 28 : 19, lineHeight: 1.1, color: '#C8443F' }}>Hooray, {to}!</div>
        <h1 style={{ ...line, margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: laptop ? 40 : 23, lineHeight: 1.05 }}>{from} sent you a sweet</h1>
      </div>
    </div>
  );
}

/** R1 cherry "Unwrap your sweet" button. */
export function UnwrapButton({ onClick, variant }: { onClick: () => void; variant: Variant }) {
  return <button type="button" data-btn="1" onClick={onClick} className={cx(s.reset, s.unwrap, s[variant])}>Unwrap your sweet</button>;
}

export { s as ui, cx };
export type { Ref };
