'use client';
import { useMemo } from 'react';
import { LaptopFrame, PhoneFrame } from './frames';
import { useViewport } from './useViewport';
import { useKeys } from './useKeys';
import { useSender } from './sender/useSender';
import { LaptopSender, laptopSenderKeys } from './sender/LaptopSender';
import { PhoneSender } from './sender/PhoneSender';
import { useReceiver } from './receiver/useReceiver';
import { LaptopReceiver } from './receiver/LaptopReceiver';
import { PhoneReceiver } from './receiver/PhoneReceiver';
import { LAPTOP_MOTION, PHONE_BREAKPOINT, PHONE_MOTION, laptopGeo, phoneGeo } from '@/lib/layout';

/** Sender flow S1–S5 on one route, plus "Preview as Mia sees it" from S5. */
export function SenderApp() {
  const vp = useViewport();
  const sender = useSender();
  const { st, set } = sender;
  const phone = !!vp && vp.vw < PHONE_BREAKPOINT;
  const startPreview = () => set({ preview: true });
  const keys = laptopSenderKeys(sender);
  useKeys({ back: keys.back, next: keys.next }, !!vp && !phone && !st.preview);

  if (!vp) return <div style={{ position: 'fixed', inset: 0, background: 'var(--polka)' }} />;
  if (st.preview && st.id) return <Preview id={st.id} toName={st.to || 'them'} phone={phone} vw={vp.vw} vh={vp.vh} onExit={() => set({ preview: false, step: 's5' })} />;
  if (phone) {
    const L = phoneGeo(vp.vw, vp.vh);
    return <PhoneFrame L={L}><PhoneSender L={L} sender={sender} onPreview={startPreview} /></PhoneFrame>;
  }
  const g = laptopGeo(vp.vw, vp.vh);
  return <LaptopFrame g={g}><LaptopSender g={g} sender={sender} onPreview={startPreview} /></LaptopFrame>;
}

/** The receiver experience, loaded from the real link, with the preview bar on top. */
function Preview({ id, toName, phone, vw, vh, onExit }: { id: string; toName: string; phone: boolean; vw: number; vh: number; onExit: () => void }) {
  const rc = useReceiver(id, phone ? PHONE_MOTION : LAPTOP_MOTION);
  const preview = useMemo(() => ({ toName, onReplay: rc.restart, onExit }), [toName, rc.restart, onExit]);
  useKeys({ back: onExit, next: rc.screen === 'r1' ? rc.unwrap : null, mute: rc.toggleMute }, !phone);
  if (phone) {
    const L = phoneGeo(vw, vh);
    return <PhoneFrame L={L}><PhoneReceiver L={L} rc={rc} preview={preview} onSendBack={onExit} onMakeNew={onExit} /></PhoneFrame>;
  }
  const g = laptopGeo(vw, vh, true);
  return <LaptopFrame g={g}><LaptopReceiver g={g} rc={rc} preview={preview} onSendBack={onExit} onMakeNew={onExit} /></LaptopFrame>;
}
