import { NextResponse } from 'next/server';
import { parseSweetInput } from '@/lib/sweet';
import { createSweet } from '@/lib/store';
import { saveOgPng } from '@/lib/og';

export const runtime = 'nodejs';

/** POST /api/sweets → { id }. Created when the sender presses "Wrap it up". */
export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const parsed = parseSweetInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const sweet = createSweet(parsed.value);
  // Pre-render the link preview. If it fails it is rendered again on first request.
  try { saveOgPng(sweet); } catch (e) { console.error('og render failed', e); }
  return NextResponse.json({ id: sweet.id }, { status: 201 });
}
