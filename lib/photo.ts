// Photo extra: re-encode uploads on the server (resize, auto-rotate, strip EXIF and location) and
// store them next to the database. Photos are only served by sweet id, for the revealed card.
import 'server-only';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { PHOTO } from './sweet';
import { DATA_DIR } from './store';

const photoPath = (id: string) => path.join(DATA_DIR, 'photos', `${id}.jpg`);
export const photoUrl = (id: string) => `/api/sweets/${id}/photo`;

/** Returns a cleaned JPEG, or throws if the bytes aren't an image we can read. */
export async function cleanPhoto(input: Buffer): Promise<Buffer> {
  if (input.length > PHOTO.maxBytes) throw new Error('too large');
  const img = sharp(input, { failOn: 'error', limitInputPixels: 100_000_000 });
  const meta = await img.metadata();
  if (!meta.format || !['jpeg', 'png', 'webp', 'heif', 'gif', 'tiff'].includes(meta.format)) throw new Error('unsupported');
  // .rotate() bakes in the EXIF orientation; sharp drops all metadata (EXIF, GPS, ICC) unless asked to keep it.
  return img.rotate().resize({ width: PHOTO.maxSide, height: PHOTO.maxSide, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#FFF9EC' }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
}

export function savePhoto(id: string, jpeg: Buffer) {
  fs.mkdirSync(path.dirname(photoPath(id)), { recursive: true });
  fs.writeFileSync(photoPath(id), jpeg);
}

export function loadPhoto(id: string): Buffer | null {
  try { return fs.readFileSync(photoPath(id)); } catch { return null; }
}
