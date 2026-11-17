'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { playSound, readMuted, UNWRAP_CUES, writeMuted } from '@/lib/sound';
import type { Motion } from '@/lib/layout';
import type { Sweet } from '@/lib/sweet';

/** r0 fetching · r0err couldn't load · r1 arrival · unwrap · r4 revealed · r5 not found */
export type RScreen = 'r0' | 'r0err' | 'r1' | 'unwrap' | 'r4' | 'r5';

export function useReceiver(id: string, motion: Motion) {
  const [screen, setScreen] = useState<RScreen>('r0');
  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [replay, setReplay] = useState(0);
  const [muted, setMuted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mutedRef = useRef(muted); mutedRef.current = muted;
  const motionRef = useRef(motion); motionRef.current = motion;

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => { setMuted(readMuted()); }, []);

  const load = useCallback(async () => {
    clear();
    setScreen('r0');
    const started = Date.now();
    let next: RScreen, data: Sweet | null = null;
    try {
      const res = await fetch(`/api/sweets/${encodeURIComponent(id)}`, { cache: 'no-store' });
      if (res.status === 404) next = 'r5';
      else if (!res.ok) next = 'r0err';
      else { data = (await res.json()) as Sweet; next = 'r1'; }
    } catch { next = 'r0err'; }
    // Let the rocking candy show for a beat so the arrival doesn't flash.
    const wait = Math.max(0, 700 - (Date.now() - started));
    later(() => { if (data) setSweet(data); setScreen(next); }, wait);
  }, [id]);

  useEffect(() => { void load(); return clear; }, [load]);

  const screenRef = useRef(screen); screenRef.current = screen;
  const unwrap = useCallback(() => {
    if (screenRef.current !== 'r1') return;
    clear();
    const m = motionRef.current, k = m.dur / 1.9;
    for (const [cue, t] of UNWRAP_CUES) later(() => playSound(cue, { muted: mutedRef.current }), t * 1000 * (cue === 'slide' ? m.hold / 2350 : k));
    later(() => setScreen('r4'), m.hold);
    setReplay((n) => n + 1);
    screenRef.current = 'unwrap';
    setScreen('unwrap');
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => { writeMuted(!m); return !m; }), []);
  /** Preview "Replay": back to the arrival screen. */
  const restart = useCallback(() => { clear(); setScreen(sweet ? 'r1' : 'r0'); if (!sweet) void load(); }, [sweet, load]);

  return { screen, sweet, replay, muted, load, unwrap, toggleMute, restart };
}
export type Receiver = ReturnType<typeof useReceiver>;
