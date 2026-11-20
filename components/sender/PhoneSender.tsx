'use client';
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CandyInTray, FabricSwatch, NoteCard, RibbonSwatch, Sticker } from '@/components/art';
import { ErrorDot, Field, IouCoupon, LabelWordmark, LockIcon, MiniCandy, PrimaryButton, SecondaryButton, StepBar, TextLink, WaxSeal, cx, ui } from '@/components/ui';
import { CARDS, FABRICS, RIBBONS, STICKERS, cardPad } from '@/lib/art';
import { PHONE_MOTION, type PhoneGeo } from '@/lib/layout';
import { hostOf, isFullUrl, stickerName } from '@/lib/sweet';
import { displayLink } from '@/lib/site';
import { PhotoEditor, TapedPrint } from '@/components/photo';
import type { Sender } from './useSender';

type Tab = 'paper' | 'ribbon' | 'sticker';
const sheet = (top: number, extra?: CSSProperties): CSSProperties => ({ position: 'absolute', left: -2, right: -2, top, bottom: 0, background: '#FBF0DA', border: '2px solid #783E19', borderBottom: 0, borderRadius: '22px 22px 0 0', display: 'flex', flexDirection: 'column', ...extra });
const title = (fs: number, lh = 1.1): CSSProperties => ({ margin: 0, fontWeight: 400, fontFamily: "'IM Fell DW Pica',serif", fontSize: fs, lineHeight: lh });
const stage = (y: number, k: number): CSSProperties => ({ position: 'absolute', left: 0, top: 0, width: 390, height: 844, transform: `translateY(${y}px) scale(${k})`, transformOrigin: '50% 0' });
const tileName: CSSProperties = { font: "600 8.5px/1.25 'Work Sans',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase', textAlign: 'center' };
const bottomBar: CSSProperties = { position: 'absolute', left: 22, right: 22, bottom: 30 };
const card: CSSProperties = { position: 'absolute', left: 16, right: 16, bottom: 30, background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 6, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '6px 6px 0 rgba(31,42,68,.22)' };

export function PhoneSender({ L, sender, onPreview }: { L: PhoneGeo; sender: Sender; onPreview: () => void }) {
  const { st, set, go, setText, wrap, copy, choosePhoto, removePhoto } = sender;
  const [tab, setTab] = useState<Tab>('paper');
  const linkRef = useRef<HTMLDivElement>(null);
  const tName = stickerName(st.to);
  const candyOpts = { fab: st.paper, rib: st.ribbon, sticker: st.sticker, name: tName, dur: PHONE_MOTION.dur };
  const stepN = { s1: 0, s2: 1, s3: 2, s4: 3, s5: 4 }[st.step];
  const fSel = FABRICS.find((f) => f.key === st.paper)!, rSel = RIBBONS.find((r) => r.key === st.ribbon)!, sSel = STICKERS.find((s) => s.key === st.sticker)!;
  const okUrl = isFullUrl(st.url);

  const heart = st.card === 'card_1';
  const padOf = (w: number, h: number) => cardPad(st.card, w, h).map((v) => Math.round(v) + 'px').join(' ');
  const bigH = heart ? 212 : 186, midH = heart ? 186 : 170;
  const len = st.note.length, fsBig = (len <= 90 ? 15 : len <= 170 ? 12.5 : 10.5) * (heart ? 0.8 : 1);
  const align = (heart ? 'center' : 'left') as CSSProperties['textAlign'], fromAlign = heart ? 'center' : 'flex-end';

  const tiles = (items: { key: string; name: string }[], sel: string, pick: (k: string) => void, el: (k: string) => ReactNode, box: CSSProperties) => (
    <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 10, padding: '12px 2px 6px' }}>
      {items.map((r) => (
        <button type="button" role="radio" aria-checked={r.key === sel} key={r.key} onClick={() => pick(r.key)} className={cx(ui.reset, ui.pTile)}>
          <div style={{ position: 'relative', width: '100%', height: 58 }}>
            {r.key === sel && <div className={ui.ring} />}
            <div style={{ position: 'absolute', inset: 0, border: '2px solid #783E19', borderRadius: 6, overflow: 'hidden', boxSizing: 'border-box', ...box }}>{el(r.key)}</div>
          </div>
          <div style={tileName}>{r.name}</div>
        </button>
      ))}
    </div>
  );

  const noteOnCard = (w: number, h: number, sz: 'big' | 'mid') => {
    const big = sz === 'big';
    return (
      <div style={{ position: 'absolute', left: big ? 58 : 70, top: 310 - h, width: w, height: h }}>
        <div style={{ position: 'absolute', inset: 0 }}><NoteCard style={st.card} w={w} h={h} shadow /></div>
        <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', padding: padOf(w, h), textAlign: align, display: 'flex', flexDirection: 'column', gap: big ? (heart ? 4 : 6) : (heart ? 3 : 5), overflow: 'hidden' }}>
          <div style={{ font: `700 ${big ? 9.5 : 8}px/1 'Work Sans',sans-serif`, letterSpacing: '.2em', textTransform: 'uppercase' }}>to {st.to}</div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', fontFamily: "'IM Fell DW Pica',serif", fontSize: big ? fsBig : Math.round(fsBig * 8.2) / 10, lineHeight: 1.3, textWrap: 'pretty', overflowWrap: 'anywhere' } as CSSProperties}>{st.note}</div>
          <div style={{ alignSelf: fromAlign, fontFamily: "'La Belle Aurore',cursive", fontSize: big ? (heart ? 14 : 18) : (heart ? 12 : 15), lineHeight: 1 }}>from {st.from}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {st.step === 's1' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={stage(L.g1.y, L.g1.k)}>
            <CandyInTray trayLeft={0} trayTop={139} trayScale={1} candyLeft={21} candyTop={305} candyWidth={348} candy={candyOpts} />
          </div>
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 30, background: '#FBF0DA', border: '2px solid #783E19', borderRadius: 10, padding: 6, boxShadow: '6px 6px 0 rgba(31,42,68,.22)' }}>
            <div style={{ border: '1.5px solid #783E19', borderRadius: 5, padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
              <LabelWordmark variant="phone" />
              <h1 style={{ ...title(34, 1.05), textWrap: 'balance' } as CSSProperties}>Wrap a little something</h1>
              <div style={{ font: "400 15px/1.5 'Work Sans',sans-serif", textWrap: 'pretty' } as CSSProperties}>Choose a fabric and a ribbon, tuck a note or a gift inside, and send it as a link.</div>
              <PrimaryButton variant="phone" onClick={() => go('s2')} style={{ marginTop: 6 }}>Start wrapping</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {stepN > 0 && (
        <div style={{ position: 'absolute', top: 54, left: 20, right: 20, zIndex: 3 }}><StepBar variant="phone" step={stepN} /></div>
      )}

      {st.step === 's2' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={stage(L.g2.y, L.g2.k)}>
            <CandyInTray trayLeft={0} trayTop={-1} trayScale={1} candyLeft={21} candyTop={165} candyWidth={348} candy={candyOpts} />
          </div>
          <div style={sheet(L.sheet2, { padding: '22px 22px 0', gap: 6 })}>
            <h1 style={{ ...title(26), marginBottom: 6 }}>Wrap your sweet</h1>
            <div role="tablist" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', borderBottom: '1.5px solid rgba(120,62,25,.3)' }}>
              {([['paper', 'Paper', fSel.name], ['ribbon', 'Ribbon', rSel.name], ['sticker', 'Sticker', sSel.name]] as const).map(([k, l, v]) => (
                <button type="button" role="tab" aria-selected={k === tab} key={k} onClick={() => setTab(k)} className={cx(ui.reset, ui.pTab)}>
                  <div style={{ font: k === tab ? "700 10px/1 'Work Sans',sans-serif" : "500 10px/1 'Work Sans',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontFamily: "'IM Fell DW Pica',serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
                  {k === tab && <div style={{ position: 'absolute', left: 0, right: 8, bottom: -1.5, height: 3, background: '#783E19', borderRadius: 2 }} />}
                </button>
              ))}
            </div>
            {tab === 'paper' && tiles(FABRICS, st.paper, (k) => set({ paper: k as never }), (k) => <FabricSwatch k={k} />, {})}
            {tab === 'ribbon' && tiles(RIBBONS, st.ribbon, (k) => set({ ribbon: k as never }), (k) => <RibbonSwatch k={k} />, { background: '#FFF9EC', padding: '7px 8px' })}
            {tab === 'sticker' && tiles(STICKERS, st.sticker, (k) => set({ sticker: k as never }), (k) => <Sticker k={k} name={tName} />, { background: '#FFF9EC', padding: 4 })}
            {L.showNote && <div style={{ font: "400 13px/1.45 'Work Sans',sans-serif", marginTop: 2 }}>{tab === 'paper' ? fSel.note : tab === 'ribbon' ? rSel.note : 'The sticker carries their name on the wrapped sweet.'}</div>}
            <div style={bottomBar}><PrimaryButton variant="phone" onClick={() => go('s3')}>Next</PrimaryButton></div>
          </div>
        </div>
      )}

      {st.step === 's3' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={stage(L.g3.y, L.g3.k)}>{noteOnCard(274, bigH, 'big')}</div>
          <div style={sheet(L.sheet3, { overflow: 'hidden', padding: '20px 22px 0', gap: 12 })}>
            <h1 style={title(26)}>Write your note</h1>
            <div role="radiogroup" aria-label="Note card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '8px 2px 0' }}>
              {CARDS.map((c) => (
                <button type="button" role="radio" aria-checked={c.key === st.card} key={c.key} onClick={() => set({ card: c.key as never })} className={cx(ui.reset, ui.pTile)}>
                  <div style={{ position: 'relative', width: '100%', height: L.cardTile }}>
                    {c.key === st.card && <div className={ui.ring} />}
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid #783E19', borderRadius: 6, background: '#FFF9EC', overflow: 'hidden' }}><NoteCard style={c.key} w={56} h={38} sw={1.3} center /></div>
                  </div>
                  <div style={{ ...tileName, textTransform: 'none' }}>{c.name}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="To" gap={7}>
                <div className={ui.pField}>
                  <input className={ui.pInput} value={st.to} onChange={(e) => setText('to', e.target.value)} maxLength={40} placeholder="Their name" />
                  <span style={{ font: "500 11px/1 'Work Sans',sans-serif", color: '#6B4A36', fontVariantNumeric: 'tabular-nums' }}>{st.to.length}/40</span>
                </div>
              </Field>
              <Field label="From" gap={7}>
                <div className={ui.pField}><input className={ui.pInput} value={st.from} onChange={(e) => setText('from', e.target.value)} maxLength={40} placeholder="Your name" /></div>
              </Field>
            </div>
            <Field label="Message" count={`${st.note.length}/280`} gap={7}>
              <textarea className={ui.pTextarea} value={st.note} onChange={(e) => setText('note', e.target.value)} maxLength={280} placeholder="Write something sweet…" style={{ height: L.ta }} />
            </Field>
            <div style={{ ...bottomBar, display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 12 }}>
              <SecondaryButton variant="phone" onClick={() => go('s2')}>Back</SecondaryButton>
              <PrimaryButton variant="phone" onClick={() => go('s4')}>Next</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {st.step === 's4' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={stage(L.g4.y, L.g4.k)}>
            {noteOnCard(250, midH, 'mid')}
            {st.extra === 'link' && (
              <div style={{ position: 'absolute', left: 286, top: 248, pointerEvents: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, filter: 'url(#sealwob)' }}>
                  <WaxSeal size={74} />
                  <div style={{ font: "600 9.5px/1 'Work Sans',sans-serif", background: '#FBF0DA', border: '1.2px solid #783E19', borderRadius: 999, padding: '4px 8px', whiteSpace: 'nowrap' }}>{okUrl ? hostOf(st.url) : 'your link'}</div>
                </div>
              </div>
            )}
            {st.extra === 'iou' && (
              <div style={{ position: 'absolute', left: 226, top: 116, width: 148, transform: 'rotate(7deg)', pointerEvents: 'none', filter: 'drop-shadow(0 3px 3px rgba(90,42,16,.28))' }}>
                <IouCoupon text={st.iou} size="pStage" />
              </div>
            )}
            {st.extra === 'photo' && (
              <TapedPrint size="phoneStage" src={st.photo?.url ?? null} caption={st.caption} style={{ position: 'absolute', left: 280, top: 104, transform: 'rotate(7deg)' }} />
            )}
          </div>
          <div style={sheet(L.sheet3, { overflow: 'hidden', padding: '20px 22px 0', gap: 12 })}>
            <h1 style={title(26)}>Add a little extra</h1>
            <div role="radiogroup" aria-label="Extra" style={{ display: 'flex', flexDirection: 'column', borderTop: '1.5px solid rgba(120,62,25,.3)', flex: 'none' }}>
              {([['none', 'Nothing', 'Just the note'], ['link', 'Link', 'A playlist, a booking'], ['iou', 'IOU', 'A promise to keep'], ['photo', 'Photo', 'A snapshot to keep']] as const).map(([k, l, hint]) => (
                <button type="button" role="radio" aria-checked={k === st.extra} key={k} onClick={() => set({ extra: k, urlError: false, photoError: null })} className={cx(ui.reset, ui.pTypeRow)}>
                  <MiniCandy fill={k === st.extra ? '#F3E08A' : '#FFF9EC'} w={34} h={18} sw={1.8} seams={false} />
                  <span style={{ fontFamily: "'IM Fell DW Pica',serif", fontStyle: k === st.extra ? 'italic' : 'normal', fontSize: 19, lineHeight: 1, flex: 1 }}>{l}</span>
                  <span style={{ font: "400 12px/1 'Work Sans',sans-serif" }}>{hint}</span>
                </button>
              ))}
            </div>
            {st.extra === 'link' && (
              <Field label="URL" gap={7}>
                <div className={cx(ui.pField, st.urlError && ui.pFieldErr)}>
                  <input className={ui.pInput} value={st.url} onChange={(e) => setText('url', e.target.value)} placeholder="https://" inputMode="url" autoCapitalize="off" autoCorrect="off" aria-invalid={st.urlError} style={{ fontSize: 14 }} />
                </div>
                {st.urlError && <span style={{ display: 'flex', alignItems: 'center', gap: 7, font: "600 12px/1.3 'Work Sans',sans-serif", letterSpacing: 0, textTransform: 'none' }}><ErrorDot size={16} />That&apos;s not a full link yet. Start it with https://</span>}
              </Field>
            )}
            {st.extra === 'iou' && (
              <Field label="IOU" count={`${st.iou.length}/80`} gap={7}>
                <div className={ui.pField}><input className={ui.pInput} value={st.iou} onChange={(e) => setText('iou', e.target.value)} maxLength={80} placeholder="One coffee date ☕" /></div>
              </Field>
            )}
            {st.extra === 'photo' && (
              <PhotoEditor variant="phone" ph={L.tight ? 60 : 96} printW={L.tight ? 79 : 115} src={st.photo?.url ?? null} caption={st.caption} error={st.photoError}
                onCaption={(v) => setText('caption', v)} onPick={choosePhoto} onRemove={removePhoto} />
            )}
            {st.wrapError && (
              <div role="alert" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 12px', background: '#FFF9EC', border: '2px solid #C8443F', borderRadius: 4, boxShadow: '0 0 0 2px rgba(200,68,63,.18)' }}>
                <ErrorDot />
                <span style={{ font: "500 12.5px/1.4 'Work Sans',sans-serif" }}><b style={{ fontWeight: 600 }}>We couldn&apos;t wrap it just now.</b> Everything is still here, so try again.</span>
              </div>
            )}
            <div style={{ ...bottomBar, display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 12 }}>
              <SecondaryButton variant="phone" onClick={() => go('s3')}>Back</SecondaryButton>
              <PrimaryButton variant="phone" onClick={wrap} busy={st.wrapping}>{st.wrapping ? 'Wrapping…' : st.wrapError ? 'Try again' : 'Wrap it up'}</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {st.step === 's5' && st.id && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={stage(L.g5.y, L.g5.k)}>
            <CandyInTray trayLeft={0} trayTop={99} trayScale={1} candyLeft={21} candyTop={265} candyWidth={348} candy={candyOpts} />
          </div>
          <div style={card}>
            <h1 style={title(30)}>Your sweet is ready</h1>
            <div ref={linkRef} style={{ padding: 14, background: st.copyFailed ? '#F3E08A' : '#FFF9EC', border: '2px dashed #783E19', borderRadius: 4, font: "600 15px/1 'Work Sans',sans-serif", letterSpacing: '.01em', textAlign: 'center', userSelect: 'all', WebkitUserSelect: 'all', overflowWrap: 'anywhere' }}>{displayLink(st.id)}</div>
            {st.copyFailed && (
              <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginTop: -4, font: "600 12px/1.35 'Work Sans',sans-serif" }}><ErrorDot size={16} />Copying was blocked. Press and hold the link to copy it.</div>
            )}
            <PrimaryButton variant="phone" onClick={() => copy(linkRef.current)} style={{ marginTop: 2 }}>{st.copied ? 'Copied ✓' : 'Copy link'}</PrimaryButton>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, font: "500 12px/1.3 'Work Sans',sans-serif" }}><LockIcon />Only people with this link can open it</div>
            <TextLink variant="phone" onClick={onPreview} style={{ alignSelf: 'center' }}>Preview as {st.to || 'them'} sees it →</TextLink>
          </div>
        </div>
      )}
    </>
  );
}
