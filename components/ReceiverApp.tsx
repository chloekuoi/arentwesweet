'use client';
import { useRouter } from 'next/navigation';
import { LaptopFrame, PhoneFrame } from './frames';
import { useViewport } from './useViewport';
import { useKeys } from './useKeys';
import { useReceiver } from './receiver/useReceiver';
import { LaptopReceiver } from './receiver/LaptopReceiver';
import { PhoneReceiver } from './receiver/PhoneReceiver';
import { LAPTOP_MOTION, PHONE_BREAKPOINT, PHONE_MOTION, laptopGeo, phoneGeo } from '@/lib/layout';

/** /g/[id]: R0 fetching → R1 arrival → unwrap → R4, or R5 / load error. */
export function ReceiverApp({ id }: { id: string }) {
  const vp = useViewport();
  const phone = !!vp && vp.vw < PHONE_BREAKPOINT;
  const rc = useReceiver(id, phone ? PHONE_MOTION : LAPTOP_MOTION);
  const router = useRouter();
  const home = () => router.push('/');
  useKeys({ next: rc.screen === 'r1' ? rc.unwrap : rc.screen === 'r0err' ? rc.load : null, mute: rc.toggleMute }, !!vp && !phone);

  if (!vp) return <div style={{ position: 'fixed', inset: 0, background: 'var(--polka)' }} />;
  if (phone) {
    const L = phoneGeo(vp.vw, vp.vh);
    return <PhoneFrame L={L}><PhoneReceiver L={L} rc={rc} preview={null} onSendBack={home} onMakeNew={home} /></PhoneFrame>;
  }
  const g = laptopGeo(vp.vw, vp.vh);
  return <LaptopFrame g={g}><LaptopReceiver g={g} rc={rc} preview={null} onSendBack={home} onMakeNew={home} /></LaptopFrame>;
}
