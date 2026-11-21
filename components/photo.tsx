'use client';
// Photo extra: the instant print you fill on S4, and the taped print shown on the stage and on R4.
import { useRef, useState, type CSSProperties } from 'react';
import { LIMITS } from '@/lib/sweet';
import { cx, ui, type Variant } from './ui';

const INK = '#783E19';

/** The photo inside a print, or the empty placeholder colour. */
function PrintPhoto({ src, alt = '' }: { src: string | null; alt?: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(120,62,25,.5)', background: src ? '#E2BC97' : '#EFE3CF', overflow: 'hidden' }}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  );
}

function CameraIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 30 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="M2,7 H8 L11,3 H19 L22,7 H28 V22 H2Z" /><circle cx="15" cy="14" r="5" />
    </svg>
  );
}

/** Sizes for the taped prints, from SweetLaptop.dc.html / SweetPhone.dc.html. */
export const PRINTS = {
  laptopStage: { w: 230, pad: 12, photo: 200, strip: 46, cap: 21, tape: [90, 24, -14] },
  laptopReveal: { w: 300, pad: 14, photo: 270, strip: 56, cap: 26, tape: [110, 28, -17] },
  phoneStage: { w: 96, pad: 7, photo: 80, strip: 22, cap: 12, tape: [44, 14, -8] },
  phoneReveal: { w: 172, pad: 8, photo: 154, strip: 34, cap: 17, tape: [60, 18, -11] },
} as const;
export type PrintSize = keyof typeof PRINTS;

/** A print taped on with pink washi tape (dashed brown ends). Positioning and rotation come from `style`. */
export function TapedPrint({ size, src, caption, style }: { size: PrintSize; src: string | null; caption: string; style?: CSSProperties }) {
  const S = PRINTS[size], [tw, th, tt] = S.tape;
  return (
    <div style={{ position: 'relative', width: S.w, pointerEvents: 'none', filter: 'drop-shadow(0 4px 3px rgba(90,42,16,.3))', ...style }}>
      <div style={{ background: '#FFF9EC', border: `1.5px solid ${INK}`, padding: `${S.pad}px ${S.pad}px 0` }}>
        <div style={{ position: 'relative', height: S.photo }}><PrintPhoto src={src} alt={caption ? `Photo: ${caption}` : 'Photo'} /></div>
        <div style={{ height: S.strip, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'La Belle Aurore',cursive", fontSize: S.cap, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{caption}</div>
      </div>
      <div aria-hidden style={{ position: 'absolute', left: '50%', top: tt, width: tw, height: th, marginLeft: -tw / 2, background: 'rgba(245,205,211,.85)', borderLeft: '1.2px dashed rgba(120,62,25,.5)', borderRight: '1.2px dashed rgba(120,62,25,.5)', transform: 'rotate(-6deg)' }} />
    </div>
  );
}

/**
 * S4 "write on the print" editor. The whole photo area is the file picker (camera or library on
 * phone); on laptop a file can also be dropped onto it. The caption is typed on the white strip.
 */
export function PhotoEditor({ variant, ph, printW, src, caption, error, onCaption, onPick, onRemove }: {
  variant: Variant; ph: number; printW: number; src: string | null; caption: string; error: string | null;
  onCaption: (v: string) => void; onPick: (f: File | undefined) => void; onRemove: () => void;
}) {
  const laptop = variant === 'laptop';
  const [over, setOver] = useState(false);
  const pickRef = useRef<HTMLInputElement>(null);
  const has = !!src;
  const hint = has ? 'Write a caption on the white strip, just like a real print.'
    : laptop ? 'Click the print to choose a photo, or drag one onto it.' : 'Tap the print to take a photo or choose one.';
  const fileInput = (ref?: React.Ref<HTMLInputElement>, label = 'Choose a photo') => (
    <input ref={ref} type="file" accept="image/*" aria-label={label} title={label}
      onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ''; }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
  );
  const link: CSSProperties = { textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, padding: '4px 0 0 4px' }}>
      <div style={{ flex: 'none', width: printW, background: '#FFF9EC', border: `1.5px solid ${INK}`, padding: '8px 8px 0', boxSizing: 'border-box', transform: 'rotate(-2deg)', boxShadow: '0 3px 3px rgba(90,42,16,.2)' }}>
        <div className={ui.photoPick} style={{ position: 'relative', height: ph, outline: over ? '2px solid #A7C3E8' : undefined, outlineOffset: 2 }}
          onDragOver={laptop ? (e) => { e.preventDefault(); setOver(true); } : undefined}
          onDragLeave={laptop ? () => setOver(false) : undefined}
          onDrop={laptop ? (e) => { e.preventDefault(); setOver(false); onPick(e.dataTransfer.files?.[0]); } : undefined}>
          {has ? <PrintPhoto src={src} alt="Your photo" /> : (
            <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(120,62,25,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center' }}>
              <CameraIcon w={laptop ? 30 : 24} h={laptop ? 24 : 19} />
              <span style={{ fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: laptop ? 18 : 15, lineHeight: 1 }}>{laptop ? 'Choose or drop' : 'Tap to add'}</span>
            </div>
          )}
          {fileInput(pickRef, has ? 'Replace photo' : 'Choose a photo')}
        </div>
        <input value={caption} onChange={(e) => onCaption(e.target.value)} maxLength={LIMITS.caption} placeholder="write a caption…" aria-label="Caption"
          className={ui.caption} style={{ height: laptop ? 44 : 30, fontSize: laptop ? 20 : 16 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6 }}>
        <div style={{ font: `400 ${laptop ? 13 : 12}px/1.4 'Work Sans',sans-serif`, textWrap: 'pretty' } as CSSProperties}>{hint}</div>
        <div style={{ font: "500 11px/1 'Work Sans',sans-serif", color: '#6B4A36' }}>Caption {caption.length}/{LIMITS.caption}</div>
        {has && (
          <div style={{ display: 'flex', gap: 16, font: "600 13px/1 'Work Sans',sans-serif" }}>
            <span className={ui.photoLink} style={{ ...link, position: 'relative', overflow: 'hidden' }}>Replace{fileInput(undefined, 'Replace photo')}</span>
            <button type="button" data-btn="1" onClick={onRemove} className={cx(ui.reset, ui.photoLink)} style={{ ...link, color: '#C8443F', font: 'inherit' }}>Remove</button>
          </div>
        )}
        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 7, font: "600 12px/1.35 'Work Sans',sans-serif" }}>
            <span aria-hidden style={{ flex: 'none', width: 16, height: 16, borderRadius: '50%', background: '#C8443F', color: '#FBF0DA', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 11px/1 'Work Sans',sans-serif" }}>!</span>{error}
          </div>
        )}
      </div>
    </div>
  );
}
