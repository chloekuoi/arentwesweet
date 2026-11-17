import { getSweet } from '@/lib/store';
import { loadOgPng } from '@/lib/og';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sweet = getSweet(id);
  if (!sweet) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(loadOgPng(sweet)), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
