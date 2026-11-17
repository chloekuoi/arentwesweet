'use client';
import { useEffect, useState } from 'react';

/** Window size, or null until mounted (layout depends on it, so we render client-side only). */
export function useViewport() {
  const [vp, setVp] = useState<{ vw: number; vh: number } | null>(null);
  useEffect(() => {
    const fit = () => setVp({ vw: window.innerWidth, vh: window.innerHeight });
    fit();
    window.addEventListener('resize', fit);
  }, []);
  return vp;
}
