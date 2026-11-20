'use client';
import { useCallback, useRef, useState } from 'react';
import { DEFAULTS, LIMITS, PHOTO, isFullUrl, type CardKey, type PaperKey, type RibbonKey, type StickerKey, type SweetInput } from '@/lib/sweet';
import { shareLink } from '@/lib/site';

export type Step = 's1' | 's2' | 's3' | 's4' | 's5';
export type ExtraType = 'none' | 'link' | 'iou' | 'photo';
/** The chosen photo, already resized to a JPEG in the browser. `url` is an object URL for previews. */
export type Photo = { blob: Blob; url: string };

export type SenderState = {
  step: Step;
  paper: PaperKey; ribbon: RibbonKey; sticker: StickerKey; card: CardKey;
  to: string; from: string; note: string;
  extra: ExtraType; url: string; iou: string; photo: Photo | null; caption: string;
  urlError: boolean; photoError: string | null; wrapping: boolean; wrapError: boolean;
  copied: boolean; copyFailed: boolean; preview: boolean;
  id: string | null;
};

const initial: SenderState = {
  step: 's1', paper: DEFAULTS.paper, ribbon: DEFAULTS.ribbon, sticker: DEFAULTS.sticker, card: DEFAULTS.card,
  to: '', from: '', note: '', extra: 'none', url: '', iou: '', photo: null, caption: '',
  urlError: false, photoError: null, wrapping: false, wrapError: false, copied: false, copyFailed: false, preview: false, id: null,
};

export function toInput(s: SenderState): SweetInput {
  return {
    paper: s.paper, ribbon: s.ribbon, sticker: s.sticker, card: s.card, to: s.to, from: s.from, note: s.note,
    extra: s.extra === 'link' ? { type: 'link', url: s.url.trim() } : s.extra === 'iou' ? { type: 'iou', text: s.iou } : s.extra === 'photo' ? { type: 'photo', caption: s.caption } : { type: 'none' },
  };
}

const PHOTO_UNREADABLE = "We couldn't read that photo. Try a JPG or PNG.";
const PHOTO_TOO_BIG = 'That photo is too big. Try one under 10 MB.';
export const PHOTO_MISSING = 'Add a photo first, or pick Nothing.';

/**
 * Decode the chosen file, bake in its orientation and shrink it to at most 1600px as a JPEG.
 * Re-encoding through a canvas drops EXIF and location data before anything is uploaded; the
 * server re-encodes again. HEIC works wherever the browser can decode it (Safari, iOS).
 */
async function preparePhoto(file: File): Promise<Blob> {
  if (file.size > PHOTO.maxBytes) throw new Error(PHOTO_TOO_BIG);
  let src: ImageBitmap | HTMLImageElement;
  try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch {
    src = await new Promise<HTMLImageElement>((ok, fail) => {
      const img = new Image(), u = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(u); ok(img); };
      img.onerror = () => { URL.revokeObjectURL(u); fail(new Error(PHOTO_UNREADABLE)); };
      img.src = u;
    });
  }
  const w0 = 'naturalWidth' in src ? src.naturalWidth : src.width, h0 = 'naturalHeight' in src ? src.naturalHeight : src.height;
  if (!w0 || !h0) throw new Error(PHOTO_UNREADABLE);
  const k = Math.min(1, PHOTO.maxSide / Math.max(w0, h0)), w = Math.round(w0 * k), h = Math.round(h0 * k);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); if (!ctx) throw new Error(PHOTO_UNREADABLE);
  ctx.fillStyle = '#FFF9EC'; ctx.fillRect(0, 0, w, h);
  ctx.drawImage(src, 0, 0, w, h);
  if ('close' in src) src.close();
  const blob = await new Promise<Blob | null>((ok) => c.toBlob(ok, 'image/jpeg', 0.88));
  if (!blob) throw new Error(PHOTO_UNREADABLE);
  return blob;
}

export function useSender() {
  const [st, setSt] = useState<SenderState>(initial);
  const stRef = useRef(st); stRef.current = st;
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const set = useCallback((p: Partial<SenderState>) => setSt((s) => ({ ...s, ...p })), []);

  const go = useCallback((step: Step) => set({ step, urlError: false, photoError: null, preview: false, wrapError: false, copyFailed: false }), [set]);

  /** Pick a photo (file input or drop). Replaces any earlier one. */
  const choosePhoto = useCallback(async (file: File | null | undefined) => {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) { set({ photoError: PHOTO_UNREADABLE }); return; }
    try {
      const blob = await preparePhoto(file);
      const prev = stRef.current.photo; if (prev) URL.revokeObjectURL(prev.url);
      set({ photo: { blob, url: URL.createObjectURL(blob) }, photoError: null });
    } catch (e) {
      set({ photoError: e instanceof Error && e.message === PHOTO_TOO_BIG ? PHOTO_TOO_BIG : PHOTO_UNREADABLE });
    }
  }, [set]);

  const removePhoto = useCallback(() => {
    const prev = stRef.current.photo; if (prev) URL.revokeObjectURL(prev.url);
    set({ photo: null, photoError: null });
  }, [set]);

  const setText = useCallback((k: 'to' | 'from' | 'note' | 'url' | 'iou' | 'caption', v: string) =>
    set({ [k]: v.slice(0, LIMITS[k]), ...(k === 'url' ? { urlError: false } : {}) } as Partial<SenderState>), [set]);

  /** "Wrap it up": validate, POST /api/sweets, then S5. Inputs are kept on failure. */
  const wrap = useCallback(async () => {
    const s = stRef.current;
    if (s.extra === 'link' && !isFullUrl(s.url)) { set({ urlError: true }); return; }
    if (s.extra === 'photo' && !s.photo) { set({ photoError: PHOTO_MISSING }); return; }
    if (s.wrapping) return;
    set({ wrapping: true, wrapError: false });
    try {
      let res: Response;
      if (s.extra === 'photo' && s.photo) {
        // The photo is uploaded when the sweet is wrapped.
        const form = new FormData();
        form.append('data', JSON.stringify(toInput(s)));
        form.append('photo', s.photo.blob, 'photo.jpg');
        res = await fetch('/api/sweets', { method: 'POST', body: form });
        if (res.status === 400 || res.status === 413) {
          const msg = ((await res.json().catch(() => ({}))) as { error?: string }).error;
          set({ wrapping: false, photoError: msg || PHOTO_UNREADABLE });
          return;
        }
      } else {
        res = await fetch('/api/sweets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toInput(s)) });
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const { id } = (await res.json()) as { id: string };
      set({ wrapping: false, wrapError: false, id, step: 's5', preview: false, copied: false, copyFailed: false });
    } catch {
      set({ wrapping: false, wrapError: true });
    }
  }, [set]);

  /** Copy link; on failure select the link text so the sender can copy it by hand. */
  const copy = useCallback((linkEl: HTMLElement | null) => {
    const s = stRef.current; if (!s.id) return;
    const fail = () => {
      if (linkEl) { const r = document.createRange(); r.selectNodeContents(linkEl); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r); }
      set({ copyFailed: true, copied: false });
    };
    if (!navigator.clipboard) { fail(); return; }
    navigator.clipboard.writeText(shareLink(s.id)).then(() => {
      set({ copied: true, copyFailed: false });
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => set({ copied: false }), 1600);
    }, fail);
  }, [set]);

  const reset = useCallback(() => set({ step: 's1', urlError: false, extra: 'none', url: '', preview: false }), [set]);

  return { st, set, go, setText, wrap, copy, reset, choosePhoto, removePhoto };
}
export type Sender = ReturnType<typeof useSender>;
