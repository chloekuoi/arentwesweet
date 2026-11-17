'use client';
import type { ReactNode } from 'react';
import type { LaptopGeo, PhoneGeo } from '@/lib/layout';
import { SealWobbleDefs } from './ui';

/** Laptop: a W × H polka canvas scaled to fit, centred in the dark letterbox. */
export function LaptopFrame({ g, children }: { g: LaptopGeo; children: ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#2B1E16', overflow: 'hidden' }}>
      <main style={{ position: 'absolute', left: '50%', top: '50%', width: g.W, height: g.H, transform: `translate(-50%,-50%) scale(${g.scale})`, overflow: 'hidden', background: 'var(--polka)', color: '#783E19' }}>
        {children}
      </main>
    </div>
  );
}

const PAPER_NOISE = `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22220%22 height=%22220%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 .47 0 0 0 0 .24 0 0 0 0 .1 0 0 0 .11 0%22/></filter><filter id=%22m%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.018%22 numOctaves=%223%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 .47 0 0 0 0 .24 0 0 0 0 .1 0 0 0 .14 -.02%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23m)%22/><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>') 0 0/220px 220px`;

/** Phone: the 390-wide design scaled to the device width (larger phones scale up evenly). */
export function PhoneFrame({ L, children }: { L: PhoneGeo; children: ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: `${PAPER_NOISE},radial-gradient(circle,#F5CDD3 0 7px,rgba(245,205,211,0) 7.8px) 0 0/48px 48px,radial-gradient(circle,#F5CDD3 0 7px,rgba(245,205,211,0) 7.8px) 24px 24px/48px 48px,#FCF7EF`, color: '#783E19' }}>
      <SealWobbleDefs />
      <main style={{ position: 'absolute', left: 0, top: 0, width: 390, height: L.ch, transform: `scale(${L.ds})`, transformOrigin: '0 0' }}>
        {children}
      </main>
    </div>
  );
}
