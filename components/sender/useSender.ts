'use client';
import { useCallback, useRef, useState } from 'react';
import { DEFAULTS, LIMITS, isFullUrl, type CardKey, type PaperKey, type RibbonKey, type StickerKey, type SweetInput } from '@/lib/sweet';
import { shareLink } from '@/lib/site';

export type Step = 's1' | 's2' | 's3' | 's4' | 's5';
export type ExtraType = 'none' | 'link' | 'iou';

export type SenderState = {
  step: Step;
  paper: PaperKey; ribbon: RibbonKey; sticker: StickerKey; card: CardKey;
  to: string; from: string; note: string;
  extra: ExtraType; url: string; iou: string;
  urlError: boolean; wrapping: boolean; wrapError: boolean;
  copied: boolean; copyFailed: boolean; preview: boolean;
  id: string | null;
};

const initial: SenderState = {
  step: 's1', paper: DEFAULTS.paper, ribbon: DEFAULTS.ribbon, sticker: DEFAULTS.sticker, card: DEFAULTS.card,
  to: '', from: '', note: '', extra: 'none', url: '', iou: '',
  urlError: false, wrapping: false, wrapError: false, copied: false, copyFailed: false, preview: false, id: null,
};

export function toInput(s: SenderState): SweetInput {
  return {
    paper: s.paper, ribbon: s.ribbon, sticker: s.sticker, card: s.card, to: s.to, from: s.from, note: s.note,
    extra: s.extra === 'link' ? { type: 'link', url: s.url.trim() } : s.extra === 'iou' ? { type: 'iou', text: s.iou } : { type: 'none' },
  };
}

export function useSender() {
  const [st, setSt] = useState<SenderState>(initial);
  const stRef = useRef(st); stRef.current = st;
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const set = useCallback((p: Partial<SenderState>) => setSt((s) => ({ ...s, ...p })), []);

  const go = useCallback((step: Step) => set({ step, urlError: false, preview: false, wrapError: false, copyFailed: false }), [set]);

  const setText = useCallback((k: 'to' | 'from' | 'note' | 'url' | 'iou', v: string) =>
    set({ [k]: v.slice(0, LIMITS[k]), ...(k === 'url' ? { urlError: false } : {}) } as Partial<SenderState>), [set]);

  /** "Wrap it up": validate, POST /api/sweets, then S5. Inputs are kept on failure. */
  const wrap = useCallback(async () => {
    const s = stRef.current;
    if (s.extra === 'link' && !isFullUrl(s.url)) { set({ urlError: true }); return; }
    if (s.wrapping) return;
    set({ wrapping: true, wrapError: false });
    try {
      const res = await fetch('/api/sweets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toInput(s)) });
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

  return { st, set, go, setText, wrap, copy, reset };
}
export type Sender = ReturnType<typeof useSender>;
