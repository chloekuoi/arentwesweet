import { NextResponse } from 'next/server';
import { getSweet } from '@/lib/store';

export const runtime = 'nodejs';

/** GET /api/sweets/:id → the sweet, or 404. Only someone holding the id can read it. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sweet = getSweet(id);
  if (!sweet) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(sweet, { headers: { 'Cache-Control': 'private, no-store' } });
}
