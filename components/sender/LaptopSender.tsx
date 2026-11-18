'use client';
import { useRef, useState, type CSSProperties } from 'react';
import { CandyInTray, FabricSwatch, NoteCard, RibbonSwatch, Sticker } from '@/components/art';
import { ErrorDot, Field, IouCoupon, LabelWordmark, LockIcon, MiniCandy, PencilIcon, PrimaryButton, SecondaryButton, StepBar, TextLink, WaxSeal, cx, ui } from '@/components/ui';
import { CARDS, FABRICS, RIBBONS, STICKERS, cardPad } from '@/lib/art';
import { LAPTOP_MOTION, type LaptopGeo } from '@/lib/layout';
import { hostOf, isFullUrl, stickerName } from '@/lib/sweet';
import { displayLink } from '@/lib/site';
import type { Sender, Step } from './useSender';

const TITLES: Record<Step, string> = { s1: '', s2: 'Wrap your sweet', s3: 'Write your note', s4: 'Add a little extra', s5: 'Your sweet is ready' };
const hair = '1.5px solid rgba(120,62,25,.3)';
const label: CSSProperties = { font: "600 10.5px/1 'Work Sans',sans-serif", letterSpacing: '.16em' };

export function LaptopSender({ g, sender, onPreview }: { g: LaptopGeo; sender: Sender; onPreview: () => void }) {
  const { st, set, go, setText, wrap, copy } = sender;
  const linkRef = useRef<HTMLDivElement>(null);
  const [cardFocus, setCardFocus] = useState(false);
  const { pn, gs, g1, H } = g;
  const tName = stickerName(st.to);
  const candyOpts = { fab: st.paper, rib: st.ribbon, sticker: st.sticker, name: tName, dur: LAPTOP_MOTION.dur };
  const isS2 = st.step === 's2', isS3 = st.step === 's3', isS4 = st.step === 's4', isS5 = st.step === 's5';
  const stepN = { s1: 0, s2: 1, s3: 2, s4: 3, s5: 4 }[st.step];
  const okUrl = isFullUrl(st.url);

  // Note card on the stage (S3, S4)
  const heart = st.card === 'card_1';
  const sH = heart ? 420 : 350;
  const sPad = cardPad(st.card, 520, sH).map((v) => Math.round(v) + 'px').join(' ');
  const len = st.note.length;
  const scTop = (isS4 ? (st.extra === 'iou' ? 300 : 240) : 275) - (heart ? 40 : 0);
  const sc = {
    left: isS4 ? 150 : 170, top: scTop, pad: sPad, align: (heart ? 'center' : 'left') as CSSProperties['textAlign'],
    fromAlign: heart ? 'center' : 'flex-end', fs: Math.round((len <= 90 ? 27 : len <= 170 ? 22 : 18) * (heart ? 0.78 : 1)),
    from: heart ? 24 : 30, hintTop: scTop + sH + 22,
  };

  const stepGo = (k: number) => (k === 1 ? go('s2') : k === 2 ? go('s3') : k === 3 ? go('s4') : wrap());
  const nextLabel = isS4 ? (st.wrapping ? 'Wrapping…' : st.wrapError ? 'Try again' : 'Wrap it up') : 'Next';
  const back = isS3 ? () => go('s2') : isS4 ? () => go('s3') : isS5 ? () => go('s4') : isS2 ? () => go('s1') : undefined;
  const next = isS3 ? () => go('s4') : isS4 ? wrap : isS2 ? () => go('s3') : undefined;
  const fSel = FABRICS.find((f) => f.key === st.paper)!, rSel = RIBBONS.find((r) => r.key === st.ribbon)!, sSel = STICKERS.find((s) => s.key === st.sticker)!;

  const groups = [
    { label: 'PAPER', value: fSel.name, note: fSel.note, pad: '0', items: FABRICS.map((x) => ({ ...x, sel: x.key === st.paper, el: <FabricSwatch k={x.key} />, pick: () => set({ paper: x.key as never }) })) },
    { label: 'RIBBON', value: rSel.name, note: rSel.note + ' ribbon', pad: '8px', items: RIBBONS.map((x) => ({ ...x, sel: x.key === st.ribbon, el: <RibbonSwatch k={x.key} />, pick: () => set({ ribbon: x.key as never }) })) },
    { label: 'STICKER', value: sSel.name, note: st.to.trim() ? 'Sealed with ' + st.to.trim() + '’s name' : 'Sealed with their name', pad: '4px', items: STICKERS.map((x) => ({ ...x, sel: x.key === st.sticker, el: <Sticker k={x.key} name={tName} />, pick: () => set({ sticker: x.key as never }) })) },
  ];

  return (
    <>
      {st.step === 's1' && (
        <>
          <div style={{ position: 'absolute', left: g1.left, top: g1.top, width: 1440, height: 900, transform: `scale(${g1.k})`, transformOrigin: '0 0', pointerEvents: 'none' }}>
            <CandyInTray trayLeft={361.4} trayTop={-58.3} trayScale={1.8391} candyLeft={400} candyTop={247} candyWidth={640} candy={candyOpts} />
          </div>
          <div style={{ position: 'absolute', left: '50%', top: g1.cardTop, width: 600, marginLeft: -300, boxSizing: 'border-box', background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 10, padding: 8, boxShadow: '6px 6px 0 rgba(31,42,68,.22)' }}>
            <div style={{ border: '1.5px solid #783E19', borderRadius: 5, padding: '24px 40px 28px', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
              <LabelWordmark variant="laptop" />
              <h1 style={{ margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: 44, lineHeight: 1.05 }}>Wrap a little something</h1>
              <div style={{ font: "400 16px/1.5 'Work Sans',sans-serif", textWrap: 'pretty', maxWidth: 420, alignSelf: 'center' } as CSSProperties}>Choose a fabric and a ribbon, tuck a note or a gift inside, and send it as a link.</div>
              <PrimaryButton variant="laptop" onClick={() => go('s2')} style={{ marginTop: 6 }}>Start wrapping</PrimaryButton>
            </div>
          </div>
        </>
      )}

      {(isS2 || isS5) && (
        <div style={{ position: 'absolute', left: gs.left, top: gs.top, width: 860, height: 900, transform: `scale(${gs.k})`, transformOrigin: '0 0' }}>
          <CandyInTray trayLeft={71.4} trayTop={1.7} trayScale={1.8391} candyLeft={110} candyTop={307} candyWidth={640} candy={candyOpts} />
        </div>
      )}

      {(isS3 || isS4) && (
        <div style={{ position: 'absolute', left: gs.left, top: gs.top, width: 860, height: 900, transform: `scale(${gs.k})`, transformOrigin: '0 0' }}>
          <div style={{ position: 'absolute', left: sc.left, top: sc.top, width: 520, height: sH }}>
            <div style={{ position: 'absolute', inset: 0 }}><NoteCard style={st.card} w={520} h={sH} shadow /></div>
            <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: sc.pad, textAlign: sc.align, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
              <div style={{ font: "700 14px/1 'Work Sans',sans-serif", letterSpacing: '.2em', textTransform: 'uppercase' }}>to {st.to}</div>
              {isS3 ? (
                <textarea className={ui.cardText} value={st.note} onChange={(e) => setText('note', e.target.value)} onFocus={() => setCardFocus(true)} onBlur={() => setCardFocus(false)}
                  placeholder="Write something sweet…" aria-label="Message" style={{ fontSize: sc.fs, textAlign: sc.align }} />
              ) : (
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', fontFamily: "'IM Fell DW Pica',serif", fontSize: sc.fs, lineHeight: 1.3, textWrap: 'pretty', overflowWrap: 'anywhere' } as CSSProperties}>{st.note}</div>
              )}
              <div style={{ alignSelf: sc.fromAlign, fontFamily: "'La Belle Aurore',cursive", fontSize: sc.from, lineHeight: 1.2 }}>from {st.from}</div>
            </div>
          </div>
          {isS3 && (
            <div style={{ position: 'absolute', left: sc.left, top: sc.hintTop, width: 520, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FBF0DA', border: '1.5px solid #783E19', borderRadius: 999, padding: '9px 16px', font: "600 14px/1 'Work Sans',sans-serif" }}>
                <PencilIcon />{cardFocus ? 'Writing on the card · Esc to stop' : 'Click the card to write on it'}
              </div>
            </div>
          )}
          {isS4 && st.extra === 'link' && (
            <div style={{ position: 'absolute', left: 600, top: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
              <WaxSeal size={128} />
              <div style={{ font: "600 16px/1 'Work Sans',sans-serif", background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 999, padding: '7px 14px', whiteSpace: 'nowrap' }}>{okUrl ? hostOf(st.url) : 'your link'}</div>
            </div>
          )}
          {isS4 && st.extra === 'iou' && (
            <div style={{ position: 'absolute', left: 470, top: 190, width: 290, transform: 'rotate(7deg)', pointerEvents: 'none', filter: 'drop-shadow(0 5px 5px rgba(90,42,16,.28))' }}>
              <IouCoupon text={st.iou} size="stage" />
            </div>
          )}
        </div>
      )}

      {stepN > 0 && (
        <aside aria-label="Steps panel" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: pn.w, boxSizing: 'border-box', background: '#FBF0DA', borderLeft: '2px solid #783E19', padding: pn.pad, display: 'flex', flexDirection: 'column', gap: pn.gap }}>
          <StepBar variant="laptop" step={stepN} onGo={stepGo} />
          <h1 style={{ margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: pn.title, lineHeight: 1.05 }}>{TITLES[st.step]}</h1>

          {isS2 && (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: hair }}>
              {groups.map((gr) => (
                <div key={gr.label} role="radiogroup" aria-label={gr.label} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: g.wrapGap, borderBottom: hair }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={label}>{gr.label}</span>
                    <span style={{ fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: 19, lineHeight: 1 }}>{gr.value}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 14 }}>
                    {gr.items.map((r) => (
                      <button type="button" role="radio" aria-checked={r.sel} aria-label={r.name} key={r.key} data-btn="1" onClick={r.pick} className={cx(ui.reset, ui.tile)} style={{ height: pn.sw }}>
                        {r.sel && <div className={ui.ring} />}
                        <div className={ui.tileBox} style={{ padding: gr.pad }}>{r.el}</div>
                        <div className={ui.tag}>{r.name}</div>
                      </button>
                    ))}
                  </div>
                  {g.showNotes && <div style={{ font: "400 13px/1.35 'Work Sans',sans-serif", color: '#6B4A36' }}>{gr.note}</div>}
                </div>
              ))}
            </div>
          )}

          {isS3 && (
            <>
              <div role="radiogroup" aria-label="Note card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, padding: '8px 6px 0' }}>
                {CARDS.map((c) => (
                  <button type="button" role="radio" aria-checked={c.key === st.card} key={c.key} data-btn="1" onClick={() => set({ card: c.key as never })} className={cx(ui.reset, ui.cardTile)}>
                    <div style={{ position: 'relative', width: '100%', height: pn.card }}>
                      {c.key === st.card && <div className={ui.ring} />}
                      <div className={ui.tileBox}><NoteCard style={c.key} w={74} h={50} sw={1.4} center /></div>
                    </div>
                    <div style={{ font: "600 9.5px/1.2 'Work Sans',sans-serif", letterSpacing: '.1em' }}>{c.name}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                  <span style={label}>TO</span>
                  <input className={ui.input} value={st.to} onChange={(e) => setText('to', e.target.value)} maxLength={40} placeholder="Their name" style={{ paddingRight: 50 }} />
                  <span style={{ position: 'absolute', right: 14, bottom: 17, font: "500 11px/1 'Work Sans',sans-serif", color: '#6B4A36', pointerEvents: 'none' }}>{st.to.length}/40</span>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={label}>FROM</span>
                  <input className={ui.input} value={st.from} onChange={(e) => setText('from', e.target.value)} maxLength={40} placeholder="Your name" />
                </label>
              </div>
              <Field label="MESSAGE" count={`${st.note.length}/280`} countSize={10.5}>
                <textarea className={ui.textarea} value={st.note} onChange={(e) => setText('note', e.target.value)} maxLength={280} style={{ height: pn.ta }} />
              </Field>
            </>
          )}

          {isS4 && (
            <>
              <div role="radiogroup" aria-label="Extra" style={{ display: 'flex', flexDirection: 'column', borderTop: hair }}>
                {([['none', 'Nothing', 'Just the note'], ['link', 'Link', 'A playlist, a booking'], ['iou', 'IOU', 'A promise to keep']] as const).map(([k, l, hint]) => (
                  <button type="button" role="radio" aria-checked={k === st.extra} key={k} data-btn="1" onClick={() => set({ extra: k, urlError: false })} className={cx(ui.reset, ui.typeRow)}>
                    <MiniCandy fill={k === st.extra ? '#F3E08A' : '#FFF9EC'} w={42} h={22} sw={1.8} seams={false} />
                    <span style={{ fontFamily: "'IM Fell DW Pica',serif", fontStyle: k === st.extra ? 'italic' : 'normal', fontSize: 22, lineHeight: 1, flex: 1 }}>{l}</span>
                    <span style={{ font: "400 13px/1 'Work Sans',sans-serif" }}>{hint}</span>
                  </button>
                ))}
              </div>
              {st.extra === 'link' && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={label}>URL</span>
                  <input className={cx(ui.input, st.urlError && ui.inputErr)} value={st.url} onChange={(e) => setText('url', e.target.value)} placeholder="https://" inputMode="url" aria-invalid={st.urlError} style={{ fontSize: 14 }} />
                  {st.urlError && <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: "600 13px/1.3 'Work Sans',sans-serif" }}><ErrorDot />That&apos;s not a full link yet. Start it with https://</span>}
                </label>
              )}
              {st.extra === 'iou' && (
                <Field label="IOU" count={`${st.iou.length}/80`} countSize={10.5}>
                  <input className={ui.input} value={st.iou} onChange={(e) => setText('iou', e.target.value)} maxLength={80} placeholder="One coffee date" />
                </Field>
              )}
            </>
          )}

          {isS5 && st.id && (
            <>
              <div style={{ font: "400 16px/1.5 'Work Sans',sans-serif", textWrap: 'pretty' } as CSSProperties}>Wrapped in {fSel.name} with a {rSel.name} ribbon. Copy the link and send it to {st.to || 'them'} wherever you chat.</div>
              <div ref={linkRef} style={{ padding: 18, background: st.copyFailed ? '#F3E08A' : '#FFF9EC', border: '2px dashed #783E19', borderRadius: 4, font: "600 17px/1 'Work Sans',sans-serif", textAlign: 'center', userSelect: 'all', overflowWrap: 'anywhere' }}>{displayLink(st.id)}</div>
              {st.copyFailed && (
                <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: -6, font: "600 13px/1.35 'Work Sans',sans-serif" }}>
                  <ErrorDot />Your browser blocked copying. The link is selected, so press {/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘C' : 'Ctrl+C'} to copy it.
                </div>
              )}
              <PrimaryButton variant="laptop" onClick={() => copy(linkRef.current)}>{st.copied ? 'Copied ✓' : 'Copy link'}</PrimaryButton>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: "500 13px/1.3 'Work Sans',sans-serif" }}><LockIcon />Only people with this link can open it</div>
            </>
          )}

          {isS4 && st.wrapError && (
            <div role="alert" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', background: '#FFF9EC', border: '2px solid #C8443F', borderRadius: 4, boxShadow: '0 0 0 2px rgba(200,68,63,.18)' }}>
              <ErrorDot size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ font: "600 14px/1.3 'Work Sans',sans-serif" }}>We couldn&apos;t wrap it just now</span>
                <span style={{ font: "400 13px/1.4 'Work Sans',sans-serif", color: '#6B4A36' }}>Probably a connection hiccup. Everything you&apos;ve made is still here, so just try again.</span>
              </div>
            </div>
          )}
          <div style={{ flex: 1 }} />

          {isS2 && <PrimaryButton variant="laptop" onClick={() => go('s3')}>Next</PrimaryButton>}
          {(isS3 || isS4) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 14 }}>
              <SecondaryButton variant="laptop" onClick={back}>Back</SecondaryButton>
              <PrimaryButton variant="laptop" onClick={next} busy={isS4 && st.wrapping}>{nextLabel}</PrimaryButton>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: -4, font: "500 11px/1 'Work Sans',sans-serif", color: '#6B4A36' }}>
            {next && <span>Enter to continue</span>}
            {back && <span>Esc to go back</span>}
          </div>

          {isS5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextLink variant="laptop" onClick={() => go('s4')}>← Edit</TextLink>
              <TextLink variant="laptop" onClick={onPreview}>Preview as {st.to || 'them'} sees it →</TextLink>
            </div>
          )}
        </aside>
      )}
    </>
  );
}

/** Keyboard map for the laptop sender: Enter → next, Esc → back. */
export function laptopSenderKeys(sender: Sender) {
  const { st, go, wrap } = sender;
  const m: Record<Step, [(() => void) | null, (() => void) | null]> = {
    s1: [null, () => go('s2')], s2: [() => go('s1'), () => go('s3')], s3: [() => go('s2'), () => go('s4')],
    s4: [() => go('s3'), wrap], s5: [() => go('s4'), null],
  };
  return { back: m[st.step][0], next: m[st.step][1] };
}
