// Sound hooks. Files aren't delivered yet, so every cue is a silent no-op.
// Receiver screens only; sender screens stay silent. Respect the mute setting.
export type Cue = 'crinkle' | 'ribbonL' | 'ribbonR' | 'pop' | 'chime' | 'slide' | 'tap' | 'rustle';

const KEY = 'sweet.muted';

export function readMuted(): boolean {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
export function writeMuted(m: boolean) {
  try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* storage blocked */ }
}

/** Plays a cue. TODO: load /sounds/<cue>.mp3 once the files exist; pan ribbonL/R left and right. */
export function playSound(cue: Cue, opts: { muted: boolean }) {
  if (opts.muted) return;
  void cue;
}

/** Unwrap cue sheet, in seconds from the click (laptop timing; phone is scaled by 1.5/1.9). */
export const UNWRAP_CUES: [Cue, number][] = [
  ['crinkle', 0], ['ribbonL', 0.4], ['ribbonR', 0.45], ['pop', 0.9], ['chime', 1.05], ['slide', 2.35],
];
