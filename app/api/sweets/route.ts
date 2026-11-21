import { NextResponse } from 'next/server';
import { PHOTO, parseSweetInput, type SweetData } from '@/lib/sweet';
import { createSweet, newId } from '@/lib/store';
import { saveOgPng } from '@/lib/og';
import { cleanPhoto, photoUrl, savePhoto } from '@/lib/photo';

export const runtime = 'nodejs';

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 * POST /api/sweets → { id }. Created when the sender presses "Wrap it up".
 * JSON body, or multipart/form-data with a `data` JSON field and a `photo` file for the photo extra.
 */
export async function POST(req: Request) {
  let body: unknown, photo: File | null = null;
  const type = req.headers.get('content-type') || '';
  try {
    if (type.startsWith('multipart/form-data')) {
      if (Number(req.headers.get('content-length') || 0) > PHOTO.maxBytes + 64 * 1024) return bad('That photo is too big. Try one under 10 MB.', 413);
      const form = await req.formData();
      body = JSON.parse(String(form.get('data') ?? ''));
      const f = form.get('photo');
      photo = f instanceof File && f.size > 0 ? f : null;
    } else {
      body = await req.json();
    }
  } catch { return bad('Invalid request body'); }

  const parsed = parseSweetInput(body);
  if (!parsed.ok) return bad(parsed.error);
  const input = parsed.value, id = newId();

  let data: SweetData;
  if (input.extra.type === 'photo') {
    if (!photo) return bad('Add a photo first, or pick Nothing.');
    if (photo.size > PHOTO.maxBytes) return bad('That photo is too big. Try one under 10 MB.', 413);
    let jpeg: Buffer;
    try { jpeg = await cleanPhoto(Buffer.from(await photo.arrayBuffer())); }
    catch { return bad("We couldn't read that photo. Try a JPG or PNG."); }
    savePhoto(id, jpeg);
    data = { ...input, extra: { type: 'photo', imageUrl: photoUrl(id), caption: input.extra.caption } };
  } else {
    data = { ...input, extra: input.extra };
  }

  const sweet = createSweet(data, id);
  // Pre-render the link preview (never includes the photo). If it fails it is rendered on first request.
  try { saveOgPng(sweet); } catch (e) { console.error('og render failed', e); }
  return NextResponse.json({ id: sweet.id }, { status: 201 });
}
