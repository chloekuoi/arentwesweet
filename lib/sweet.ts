// Shared data model and validation for a Sweet (used by client and server).
export const PAPERS = ['cherry_print', 'pink_stripe', 'ticking', 'madras', 'candy_cane'] as const;
export const RIBBON_KEYS = ['blue_stitch', 'blush', 'sage', 'navy_velvet', 'bakers_twine'] as const;
export const STICKER_KEYS = ['butter_oval', 'pink_heart', 'scallop_seal', 'blue_banner', 'cream_tag'] as const;
export const CARD_KEYS = ['card_1', 'card_2', 'card_3', 'card_4'] as const;

export type PaperKey = (typeof PAPERS)[number];
export type RibbonKey = (typeof RIBBON_KEYS)[number];
export type StickerKey = (typeof STICKER_KEYS)[number];
export type CardKey = (typeof CARD_KEYS)[number];

export type Extra =
  | { type: 'none' }
  | { type: 'link'; url: string }
  | { type: 'iou'; text: string }
  | { type: 'photo'; imageUrl: string; caption: string };

/** What the client sends for a photo extra; the server adds imageUrl after storing the upload. */
export type ExtraInput = Exclude<Extra, { type: 'photo' }> | { type: 'photo'; caption: string };

type SweetBase = {
  paper: PaperKey; ribbon: RibbonKey; sticker: StickerKey; card: CardKey;
  to: string; from: string; note: string;
};
/** A sweet as submitted by the sender (photo not yet stored). */
export type SweetInput = SweetBase & { extra: ExtraInput };
/** A stored sweet. */
export type SweetData = SweetBase & { extra: Extra };
export type Sweet = SweetData & { id: string; createdAt: string };

export const LIMITS = { to: 40, from: 40, note: 280, iou: 80, url: 400, caption: 24 } as const;

/** Photo extra: accepted uploads (before resizing) and the stored size. */
export const PHOTO = { maxBytes: 10 * 1024 * 1024, maxSide: 1600 } as const;
export const DEFAULTS = { paper: 'cherry_print', ribbon: 'blue_stitch', sticker: 'butter_oval', card: 'card_2' } as const;

/** A full link: scheme, a host with a dot, and something after it. */
export const URL_RE = /^https?:\/\/[^\s\/.]+\.[^\s]{2,}$/i;
export const isFullUrl = (u: string) => URL_RE.test(u.trim());

export function hostOf(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
const pick = <T extends readonly string[]>(list: T, v: unknown): T[number] | null =>
  typeof v === 'string' && (list as readonly string[]).includes(v) ? (v as T[number]) : null;

/** Validates untrusted JSON into a SweetInput, or returns an error message. */
export function parseSweetInput(body: unknown): { ok: true; value: SweetInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Expected a JSON object' };
  const b = body as Record<string, unknown>;
  const paper = pick(PAPERS, b.paper), ribbon = pick(RIBBON_KEYS, b.ribbon);
  const sticker = pick(STICKER_KEYS, b.sticker), card = pick(CARD_KEYS, b.card);
  if (!paper || !ribbon || !sticker || !card) return { ok: false, error: 'Unknown paper, ribbon, sticker or card' };
  for (const k of ['to', 'from', 'note'] as const) {
    if (typeof b[k] !== 'string' || (b[k] as string).length > LIMITS[k]) return { ok: false, error: `${k} must be a string of at most ${LIMITS[k]} characters` };
  }
  const ex = (b.extra ?? { type: 'none' }) as Record<string, unknown>;
  let extra: ExtraInput;
  if (ex.type === 'link') {
    const url = str(ex.url, LIMITS.url).trim();
    if (!isFullUrl(url)) return { ok: false, error: "That's not a full link yet. Start it with https://" };
    extra = { type: 'link', url };
  } else if (ex.type === 'iou') {
    if (typeof ex.text !== 'string' || ex.text.length > LIMITS.iou) return { ok: false, error: `IOU must be at most ${LIMITS.iou} characters` };
    extra = { type: 'iou', text: ex.text };
  } else if (ex.type === 'photo') {
    if (typeof ex.caption !== 'string' || ex.caption.length > LIMITS.caption) return { ok: false, error: `Caption must be at most ${LIMITS.caption} characters` };
    extra = { type: 'photo', caption: ex.caption };
  } else if (ex.type === 'none') extra = { type: 'none' };
  else return { ok: false, error: 'Unknown extra type' };
  return { ok: true, value: { paper, ribbon, sticker, card, to: b.to as string, from: b.from as string, note: b.note as string, extra } };
}

/** Recipient name as it appears on the sticker. */
export const stickerName = (to: string) => to.trim() || 'you';
