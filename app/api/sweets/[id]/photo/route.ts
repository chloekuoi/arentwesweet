import { getSweet } from '@/lib/store';
import { loadPhoto } from '@/lib/photo';

export const runtime = 'nodejs';

/** The photo for a sweet's revealed card. Only reachable with the sweet's unguessable id. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sweet = getSweet(id);
  const jpeg = sweet?.extra.type === 'photo' ? loadPhoto(id) : null;
  if (!jpeg) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=31536000, immutable', 'X-Robots-Tag': 'noindex' },
  });
}
