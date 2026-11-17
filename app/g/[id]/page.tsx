import type { Metadata } from 'next';
import { ReceiverApp } from '@/components/ReceiverApp';
import { getSweet } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

/** Link preview text. Never includes the note, link or IOU. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sweet = getSweet(id);
  if (!sweet) return { title: 'Sweet', robots: { index: false } };
  const from = sweet.from.trim() || 'Someone', to = sweet.to.trim() || 'you';
  const title = `${from} sent you a sweet 🎀`;
  const description = `Something's wrapped for ${to}. Tap to unwrap it.`;
  const image = { url: `/g/${id}/opengraph-image`, width: 1200, height: 630, alt: '' };
  return {
    title, description, robots: { index: false, follow: false },
    openGraph: { title, description, siteName: 'Sweet', type: 'website', url: `/g/${id}`, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

export default async function SweetPage({ params }: Props) {
  const { id } = await params;
  return <ReceiverApp id={id} />;
}
