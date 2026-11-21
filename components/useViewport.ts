'use client';
import { useEffect, useState } from 'react';

/** True while a text field has focus, i.e. the on-screen keyboard is (or is about to be) open. */
const typing = () => {
  const el = document.activeElement as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

/** Window size, or null until mounted (layout depends on it, so we render client-side only). */
export function useViewport() {
  const [vp, setVp] = useState<{ vw: number; vh: number } | null>(null);
  useEffect(() => {
    let scrolled: HTMLElement | null = null;
    const fit = () => setVp((prev) => {
      const next = { vw: window.innerWidth, vh: window.innerHeight };
      // On phones the keyboard shrinks innerHeight. Re-laying out for that squeezes the sheet up
      // under the step bar, so keep the old height while typing unless the width (rotation) changed.
      // The frame is clipped to the shorter window instead, so bring the field being typed in into view.
      if (prev && prev.vw === next.vw && next.vh < prev.vh && typing()) {
        requestAnimationFrame(() => {
          scrolled = document.activeElement as HTMLElement | null;
          scrolled?.scrollIntoView({ block: 'center' });
        });
        return prev;
      }
      // Keyboard closed: undo that scroll so the screen sits back at the top.
      if (scrolled && (!prev || next.vh >= prev.vh)) {
        for (let el: HTMLElement | null = scrolled; el; el = el.parentElement) { el.scrollTop = 0; el.scrollLeft = 0; }
        window.scrollTo(0, 0);
        scrolled = null;
      }
      return prev && prev.vw === next.vw && prev.vh === next.vh ? prev : next;
    });
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return vp;
}
