import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Sweet',
  description: 'Wrap a little something and send it as a link.',
  openGraph: { siteName: 'Sweet' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', interactiveWidget: 'resizes-content', themeColor: '#FCF7EF' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/IMFellDWPica-Regular.ttf" as="font" type="font/ttf" crossOrigin="" />
        <link rel="preload" href="/fonts/LaBelleAurore-Regular.ttf" as="font" type="font/ttf" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
