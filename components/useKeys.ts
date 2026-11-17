'use client';
import { useEffect, useRef } from 'react';

type Keys = { back?: (() => void) | null; next?: (() => void) | null; mute?: (() => void) | null };

/**
 * Laptop keyboard: Enter → next step, Esc → back (or leave a text field), M → toggle sound.
 * Buttons and links handle their own Enter/Space.
 */
export function useKeys(keys: Keys, enabled = true) {
  const ref = useRef(keys); ref.current = keys;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement, tag = (t.tagName || '').toLowerCase();
      const field = tag === 'input' || tag === 'textarea';
      if (e.key === 'Escape' && field) { t.blur(); return; }
      if ((e.key === 'm' || e.key === 'M') && !field && !e.metaKey && !e.ctrlKey && !e.altKey && ref.current.mute) { ref.current.mute(); return; }
      if (e.key === 'Escape') { if (ref.current.back) { e.preventDefault(); ref.current.back(); } return; }
      if (e.key === 'Enter' && !e.shiftKey && tag !== 'textarea' && tag !== 'button' && tag !== 'a' && ref.current.next) { e.preventDefault(); ref.current.next(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [enabled]);
}
