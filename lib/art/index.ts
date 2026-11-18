// Typed facade over the ported illustration engine (sweet-candy.ts, box.ts).
import * as C from './sweet-candy';
import * as B from './box';

export type Pose = '' | 'anim' | 'r2' | 'r3' | 'flat' | 'melt';
export type Layer = 'body' | 'endL' | 'endR' | 'bowL' | 'bowR' | 'label';
export type CandyOpts = {
  fab: string; rib: string; sticker: string; name: string;
  pose?: Pose; dur?: number; only?: Layer; labelScale?: number;
};
export type ConfettiOpts = {
  w: number; h: number; cx: number; cy: number; n: number; seed?: number; min: number; spread: number;
  stars?: number; anim?: boolean; delay?: number; dur?: number;
};
export type Option = { key: string; name: string; note?: string };

export const FABRICS: Option[] = C.FABRICS;
export const RIBBONS: Option[] = C.RIBBONS;
export const STICKERS: Option[] = C.STICKERS;
export const CARDS: Option[] = C.CARDS;

export const candy: (o: CandyOpts) => string = C.candy;
export const candyRaw: (o: CandyOpts) => string = C.candyRaw;
export const hand: (svg: string) => string = C.hand;
export const fabricSwatch: (key: string) => string = C.fabricSwatch;
export const ribbonSwatch: (key: string) => string = C.ribbonSwatch;
export const stickerSwatch: (key: string, name: string) => string = C.stickerSwatch;
export const noteCard: (o: { style: string; w: number; h: number; shadow?: boolean; sw?: number }) => string = C.noteCard;
export const cardPad: (style: string, w: number, h: number) => [number, number, number, number] = C.cardPad as never;
export const confetti: (o: ConfettiOpts) => string = C.confetti;
export const tray: (part: 'back' | 'front') => string = (part) =>
  B.box('stripe', part, { wall: '#FBF0DA', rim: '#FFF9EC' });
