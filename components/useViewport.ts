'use client';
import { useEffect, useState } from 'react';

/** True if el is a text field, i.e. focusing it opens the on-screen keyboard. */
const editable = (el: Element | null): el is HTMLElement =>
  !!el && ((el.tagName === 'INPUT' && (el as HTMLInputElement).type !== 'file') || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable);

/**
 * Layout-viewport size. Unlike innerWidth/innerHeight, which on iOS report the zoomed or
 * keyboard-shrunk visual viewport, this only changes when the page itself is resized.
 */
const measure = () => {
  const de = document.documentElement;
  return { vw: de.clientWidth || window.innerWidth, vh: de.clientHeight || window.innerHeight };
};

/** Undo any scrolling the browser did to show a focused field. */
const unscroll = (from: Element | null) => {
  for (let el = from; el; el = el.parentElement) { el.scrollTop = 0; el.scrollLeft = 0; }
  window.scrollTo(0, 0);
};

/** Window size, or null until mounted (layout depends on it, so we render client-side only). */
export function useViewport() {
  const [vp, setVp] = useState<{ vw: number; vh: number } | null>(null);
  useEffect(() => {
    let scrolled: HTMLElement | null = null;
    const fit = () => setVp((prev) => {
      const next = measure();
      // Some browsers (Android Chrome) shrink the page for the keyboard. Re-laying out for that
      // squeezes the sheet up under the step bar, so keep the old height while typing unless the
      // width (rotation) changed. The frame is clipped to the shorter page instead, so bring the
      // field being typed in into view.
      const active = document.activeElement;
      if (prev && prev.vw === next.vw && next.vh < prev.vh && editable(active)) {
        // A keyboard sheet sizes itself to the visual viewport, so its fields are already in view.
        if (!active.closest('[data-kb-sheet]')) {
          scrolled = active;
          requestAnimationFrame(() => active.scrollIntoView({ block: 'center' }));
        }
        return prev;
      }
      if (scrolled && (!prev || next.vh >= prev.vh)) { unscroll(scrolled); scrolled = null; }
      return prev && prev.vw === next.vw && prev.vh === next.vh ? prev : next;
    });
    // Leaving the text fields (keyboard closing): put the screen back where it was. iOS pans the
    // page to show a field without firing resize, so this can't rely on the resize handler.
    const blur = (e: FocusEvent) => {
      if (editable(e.relatedTarget as Element | null)) return; // moving to another field
      const from = e.target as Element;
      setTimeout(() => { if (!editable(document.activeElement)) { unscroll(from); scrolled = null; } }, 50);
    };
    fit();
    window.addEventListener('resize', fit);
    document.addEventListener('focusout', blur);
    return () => { window.removeEventListener('resize', fit); document.removeEventListener('focusout', blur); };
  }, []);
  return vp;
}

/**
 * The visible part of the page (above the on-screen keyboard), in CSS px, while `on`.
 * Tracks window.visualViewport so a sheet can sit exactly over it instead of relying on 100vh.
 */
export function useVisualViewport(on: boolean) {
  const [vv, setVv] = useState<{ h: number; top: number } | null>(null);
  useEffect(() => {
    if (!on) { setVv(null); return; }
    const v = window.visualViewport;
    const read = () => setVv((prev) => {
      const next = v ? { h: v.height, top: Math.max(0, v.offsetTop) } : { h: window.innerHeight, top: 0 };
      return prev && prev.h === next.h && prev.top === next.top ? prev : next;
    });
    read();
    v?.addEventListener('resize', read);
    v?.addEventListener('scroll', read);
    window.addEventListener('resize', read);
    return () => { v?.removeEventListener('resize', read); v?.removeEventListener('scroll', read); window.removeEventListener('resize', read); };
  }, [on]);
  return vv;
}
