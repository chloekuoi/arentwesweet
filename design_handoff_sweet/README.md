# Handoff: Sweet — wrap a digital candy, send it as a link

> **Build from the root files only:** SweetPhone.dc.html, SweetLaptop.dc.html, Sweet App Flow.dc.html, Sweet Laptop Flow.dc.html, Sweet Style Sheet.dc.html, sweet-candy.js, box.js, doily.js.
> **Ignore `explorations/`.** It holds rejected and superseded options kept as a record. Every final choice is already in the root prototypes and in this README.
> The build prompt is in `design_handoff_sweet/CLAUDE_CODE_PROMPT.md`. If the app is already built, use `design_handoff_sweet/CHANGES_PROMPT.md` for the latest updates: the S1 welcome card and the R1 arrival.

## Overview
Sweet lets a **sender** wrap a virtual vintage candy (paper, ribbon, name sticker), tuck a note and an optional extra (link or IOU) inside, and send it as a link. The **receiver** opens the link, clicks or taps the candy to unwrap it (bows fly, confetti), and reads the note. There's no sign-in and no app install, just a web app on phone and laptop.

## About the design files
Everything listed below is an **HTML design reference**: a working prototype that shows the intended look and behaviour. It is **not production code**. Recreate it in a real stack. If there's no existing codebase, use **Next.js (App Router) + React + TypeScript + CSS Modules or Tailwind**. That gives server-rendered link previews (OG images) and simple API routes.

Open any `.dc.html` file directly in a browser; `support.js` is the prototype runtime and should not be ported. The HTML templates use `{{ holes }}` and `<sc-if>`/`<sc-for>`, and each file's logic is in the `class Component` at the bottom.

## Fidelity
**High fidelity.** Colours, type, spacing, illustration style, motion timing and copy are final. Match them exactly.

## Reference files (read in this order)
1. `Sweet Style Sheet.dc.html`: colour, type, illustration rules, components, all assets.
2. `SweetPhone.dc.html`: the clickable phone prototype, every screen. The `screen` prop/tweak jumps to any screen.
3. `SweetLaptop.dc.html`: the clickable laptop prototype (1440 × 900 base, responsive).
4. `Sweet App Flow.dc.html`: every phone screen and state side by side, plus edge cases.
5. `Sweet Laptop Flow.dc.html`: every laptop screen, hover and focus states, layout/scale rules, loading and errors.
6. `sweet-candy.js`: **the illustration engine.** It generates every candy, swatch, sticker, note card and confetti as SVG strings. **Port this file, don't redraw the art.** It's plain JS with no dependencies.
7. `box.js`: the cream tray (back and front layers). `doily.js`: the liner.

---

## Illustration engine (port as-is)
`window.SweetCandy` from `sweet-candy.js` exposes:
- `candy({fab, rib, sticker, name, pose, dur})` → SVG string. Poses: `''` resting, `'anim'` unwrap animation, `'r2'` and `'r3'` unwrap frames, `'melt'` for not found.
- `candyRaw({…, only:'body'|'endL'|'endR'|'bowL'|'bowR'})` → one layer. The candy is **5 layers: body, left end, right end, left bow, right bow**, plus the name sticker. Wrap with `hand()` for the ink jitter.
- `fabricSwatch(key)`, `ribbonSwatch(key)`, `stickerSwatch(key, name)`, `noteCard({style,w,h,shadow,sw})`, `cardPad(style,w,h)` → [top,right,bottom,left] text padding inside each card.
- `confetti({w,h,cx,cy,n,seed,min,spread,stars,anim,delay,dur})`.
- `hand(svg)` adds the fine-pen jitter filter (wobbly ink) used on all art.
- Data lists: `FABRICS`, `RIBBONS`, `STICKERS`, `CARDS` (key, name, note).

`window.SweetBox.box('stripe', 'back'|'front', {wall:'#FBF0DA', rim:'#FFF9EC'})` gives the tray. Render **back, then the candy, then front** so the candy sits inside.

Suggested port: `lib/sweet-candy.ts` exporting the same functions; render with `dangerouslySetInnerHTML` in small React wrappers (`<Candy/>`, `<Tray/>`, `<Swatch/>`). Memoize by props, since the SVGs are heavy.

**Options (keys are what you store):**
- Papers: `cherry_print` Cherry print · `pink_stripe` Pink stripe · `ticking` Ticking stripe · `madras` Picnic plaid · `candy_cane` Candy cane
- Ribbons: `blue_stitch` Stitched blue · `blush` Blush · `sage` Sage · `navy_velvet` Navy velvet · `bakers_twine` Baker's twine
- Stickers (show the recipient's name): `butter_oval` · `pink_heart` · `scallop_seal` · `blue_banner` · `cream_tag`
- Note cards: `card_1` Heart · `card_2` Airmail · `card_3` Recipe card · `card_4` Gilt frame
- Defaults: cherry_print / blue_stitch / butter_oval / card_2

---

## Design tokens
**Colour**
| Token | Hex | Use |
|---|---|---|
| ink | #783E19 | all text, lines, borders |
| ink-shadow | #5A2A10 | illustration shading (16–26% opacity) |
| ink-muted | #6B4A36 | secondary text, counters |
| paper | #FCF7EF | app background |
| dot | #F5CDD3 | polka dots: 14px circles, 48px grid, offset 24px |
| cream | #FBF0DA | panels, sheets, cards |
| cream-light | #FFF9EC | inputs, tiles, secondary button |
| cream-hover | #FFFDF6 | input hover/focus fill |
| butter | #F3E08A | primary button, active step |
| butter-hover | #F7E8A4 | primary hover |
| gold | #C9A44A | primary button inner ring |
| baby-blue | #A7C3E8 | selection ring, focus ring, wax seal |
| pink | #EBA3AE | completed step |
| cherry | #C8443F | errors |
| dark | #2B1E16 | laptop letterbox |
| navy-shadow | rgba(31,42,68,.22) | offset card shadows |

Polka background CSS:
`radial-gradient(circle,#F5CDD3 0 7px,rgba(245,205,211,0) 7.8px) 0 0/48px 48px, radial-gradient(circle,#F5CDD3 0 7px,rgba(245,205,211,0) 7.8px) 24px 24px/48px 48px, #FCF7EF`

**Type** (Google Fonts)
- **IM Fell DW Pica** (regular and italic): titles and button labels. Laptop panel title 40px (36/32 on narrower panels), phone 26px, hero 44px. Buttons are 20–22px italic.
- **Work Sans** 400/500/600/700: UI. Body 15–16px/1.5. Section labels 10.5px/600, letter-spacing .16em, uppercase. Tile labels 9px/600 .1em uppercase.
- **La Belle Aurore**: script ("from Theo", "for Mia", "Sweet" wordmark), 22–36px.

**Radii:** pill 999px · panel/card 6px · input 4px · tile 6px (selection ring 11px) · phone sheet 22px top.

**Buttons**
- Primary: bg #F3E08A, 2px #783E19 border, pill. Shadow `inset 0 0 0 3px #F3E08A, inset 0 0 0 4.5px #C9A44A, 3px 4px 0 #783E19`. Height 56 (laptop) / 50–54 (phone).
  - Hover: bg #F7E8A4, translate(-1px,-2px), outer shadow 4px 6px.
  - Pressed: translate(2px,3px), outer shadow 1px 1px.
  - Focus (keyboard only): add `0 0 0 5px #FBF0DA, 0 0 0 8px #A7C3E8, 0 0 0 9.5px #783E19`.
- Secondary: bg #FFF9EC, inner ring `inset 0 0 0 3px #FFF9EC, inset 0 0 0 4.2px rgba(120,62,25,.35)`, no offset shadow. Hover: bg #FBF0DA and inner ring at full ink.
- Selected tile: 4px #A7C3E8 ring at inset −7px plus a 1.5px ink outline. Tile hover translateY(−3px); phone press scale(.93).
- Text link: 600 14px, underline offset 3px. Hover: #C8443F with a 2px underline.
- Error input: 2px #C8443F border with `0 0 0 2px rgba(200,68,63,.25)`, plus a red "!" circle and a message.

---

## Screens
Copy is final; it's in the prototypes. Sender **S1–S5**, receiver **R0–R5**.

**Sender**
- **S1 Welcome:** the candy in the tray, and a centred cream "shop label" card (2px outer border, radius 10, 8px gap, then a 1.5px inner rule, radius 5) with "Sweet" in script between two short rules, "Wrap a little something", the body line and a full-width **Start wrapping**. See explorations/Welcome Card Options, 1b.
- **S2 Wrap it:**
  - Phone: tabs Paper / Ribbon / Sticker in a bottom sheet.
  - Laptop: all three groups in the right panel, divided by hairlines. 62px tiles with no labels; the name appears in a tag on hover or focus. Each group has its selected name at the right and a one-line note below.
- **S3 Write your note:** 4 note-card tiles, TO and FROM fields (max 40), MESSAGE (max 280), and a live card preview on the stage.
  - Laptop also lets you click the card and type on it, with a dashed hover outline and a blue focus outline.
  - Phone: typing in the sheet only.
- **S4 Add a little extra:** options Nothing / Link / IOU.
  - Link: a URL field with validation (must match `^https?://…`; error "That's not a full link yet. Start it with https://"). A baby-blue wax seal reading "OPEN ME" appears on the stage.
  - IOU: max 80 characters, shown as a butter coupon with a scalloped top and bottom and a gold paper clip.
  - The main button reads **Wrap it up**.
- **S5 Ready to send:** "Your sweet is ready", a summary line, the link in a dashed box, **Copy link** (the only share action; there's no Share button) and "Only people with this link can open it". Laptop also has "← Edit" and **"Preview as Mia sees it →"**.

**Receiver**
- **R0 Fetching:** the candy rocks (±4°, 1.6s loop) above "Fetching your sweet…" with animated dots.
- **R1 Arrival:**
  - Pill "Theo sent you a sweet" at the top, mute toggle top right, candy in the tray, and a "CLICK / TAP TO UNWRAP" pill.
  - On laptop the candy lifts on hover.
  - In-app browsers (Instagram / TikTok / Facebook UA) show the **Open in Safari nudge** once: "You're inside Instagram", pointing to •••, with "Stay here" and "Got it".
- **Unwrap:** see Motion.
- **R4 Revealed:**
  - The card rises into the centre. The 5 wrapper pieces (both bows, both ends, the sticker) land scattered around it (reveal option 5b).
  - The Link extra shows "Open your gift →" with the host name and the seal on the card's top-right corner.
  - The IOU shows the coupon beside the card (laptop) or above it (phone).
  - **Send a sweet back** returns to S1.
- **R5 Not found:** the melted candy pose, "This sweet melted" and **Make a new sweet**.
- **Load error:** "We couldn't reach your sweet" with **Try again**. This is a connection failure, which is different from R5 (bad link).

**Preview handoff** (sender previews from S5): a #783E19 bar at the top reading "PREVIEW · This is what Mia will see. Nothing has been sent." with **Replay** and **← Back to your sweet** (phone: **Done**). Esc also exits. While previewing, "Send a sweet back" returns to S5.

---

## Layout
**Phone**
- Base 390 × 844. Larger phones scale the 390 layout up evenly.
- SE (375 × 667): shorter sheets, swatch notes hidden, message box 60px tall, stage art scaled to fit.
- Step bar: 4 tiny candies (Wrap · Note · Extra · Send) spread across the full width with dashed connectors. Active candy: butter, 46 × 24. Done: pink. Upcoming: cream.

**Laptop**
- Base 1440 × 900. **Stage on the left and a 580px panel on the right (60 / 40).**
- Panel widths: 580 at 1360px and wider · 500 from 1200 to 1359 · 440 from 1024 to 1199, with smaller padding and titles.
- Under 860 tall: tiles 52px, card tiles 56px, message box 92px.
- Above 1920 × 1200 the whole canvas scales up evenly. From 900 to 1023 wide, or under 720 tall, it scales down evenly. **Under 900 wide, use the phone layout.**
- Illustrations scale with the stage (max 1.2×); UI text never scales.
- Receiver screens centre on the full width.
- Step bar spreads across the panel width. Finished steps can be clicked to go back.
- Keyboard: Tab through controls, Enter/Space activates, Enter alone goes to the next step, Esc goes back (or leaves a text field), M toggles sound. Focus rings only appear for keyboard users (`:focus-visible`).

---

## Motion
**Unwrap** — laptop timing first, phone in brackets. Keyframes are in the `<style>` block of `SweetLaptop.dc.html` and `SweetPhone.dc.html`:
- Whole candy wiggles 0–36% of the duration (±4°).
- Bows fly up and out and fade: bowL 20–68%, bowR 22–70%.
- Ends puff (scale 1.15 × 1.35) then drop and fade, 30–82%.
- Body squashes down and fades, 45–88%. The sticker spins up and off, 40–100%.
- Duration **1.9s (1.5s)**, ease-in-out.
- Confetti: **110 pieces (72)**, starts at **1.05s (0.8s)**, lasts **1.35s (1s)**, spread 640 (440), with 22 (14) stars.
- Card rises at **2.35s (1.75s)**: translateY(60px) to 0 with opacity, over .6s, cubic-bezier(.2,.9,.3,1).
- Wrapper pieces land: .7–.75s each, staggered .15–.5s, cubic-bezier(.2,1.35,.4,1).

**Other motion**
- Hover lift .12s.
- Candy hover on R1: translateY(−8px) rotate(−1.5deg), .25s spring.
- Panel and screen changes: instant (no page transitions were designed).

---

## States and data
**Sweet record** (create on "Wrap it up"):
```ts
type Sweet = {
  id: string;            // short slug, e.g. k3Fq9xT2mB, unguessable
  paper: PaperKey; ribbon: RibbonKey; sticker: StickerKey; card: CardKey;
  to: string;  // ≤40
  from: string; // ≤40
  note: string; // ≤280
  extra: { type: 'none' } | { type: 'link'; url: string } | { type: 'iou'; text: string /* ≤80 */ };
  createdAt: string;
};
```
- `POST /api/sweets` returns `{id}`. The link is `https://<domain>/g/{id}`. While the request is pending the button shows "Wrapping…" and ignores clicks. On failure, show the inline error and the button becomes "Try again"; keep all inputs.
- `GET /g/{id}`: R0 while loading, then R1. A 404 shows R5. A network or 5xx error shows the load error. "Only people with this link" means the id must be long and random; no listing endpoint.
- Copy link uses `navigator.clipboard.writeText`. On failure, select the link text and show "Your browser blocked copying… press ⌘C / Ctrl+C" (phone: "Press and hold the link to copy it"). Success shows "Copied ✓" for 1.6s.
- Mute: `localStorage['sweet.muted'] = '1' | '0'`. Sound plays on receiver screens only; sender screens are silent.

**Sender client state:** step, paper, ribbon, sticker, card, to, from, note, extra, url, iou, urlError, wrapping, wrapError, copied, copyFailed, preview.

---

## Link preview (OG image, option 7a)
- Generate per sweet at `/g/{id}/opengraph-image` (Next.js `ImageResponse`, or pre-render to PNG on create).
- Image: 1200 × 630. The polka-dot paper background, the tray at scale 1.839 positioned (241, −123), and the wrapped candy 640px wide at (280, 182) in the sweet's own paper, ribbon and sticker with the recipient's name. No text in the image.
- `og:title`: "{from} sent you a sweet 🎀"
- `og:description`: "Something's wrapped for {to}. Tap to unwrap it."
- `og:site_name`: "Sweet"
- **Never** put the note, link or IOU in the metadata.
- Note: `ImageResponse` (Satori) doesn't support SVG filters. Render the candy SVG to PNG with resvg (or headless Chromium) when the sweet is created, then serve that PNG.

---

## Assets
- All illustration is generated in code by `sweet-candy.js`, `box.js` and `doily.js`. There are no image files.
- Fonts: Google Fonts (IM Fell DW Pica, Work Sans, La Belle Aurore). Self-host them in production.
- Icons (speaker, lock, link, eye, pencil) are small inline SVGs in the prototypes; copy them.
- **Sound: not delivered yet.** See "Still to come".

---

## Still to come (not blocking the build)
1. **Sound files** (6 cues): crinkle (0s), ribbon slips ×2 panned L/R (~.4s), cellophane pop (~.9s), confetti flutter + 2-note music-box chime (~1.05s), card slide (~2.35s), paper taps as pieces land. MP3/OGG, under 1s each (chime up to 1.5s), loudness matched, chime loudest. Build the hooks now with silent placeholders.
2. Long-name and long-note edge cases, and the SE keyboard: partly prototyped in Sweet App Flow ("edge cases"), but not signed off. Use sensible truncation (ellipsis on pills, sticker name auto-fit).
3. Accessibility pass: out of scope for now. Still use `:focus-visible`, button semantics and alt text where it's cheap.
4. Product details not designed: domain name, link expiry, abuse/report, analytics.


## Update · Arrival (R1)
The "sent you a sweet" pill is now a plaque: a cream pill (2px border, 7px inset) with a 1.5px dashed inner ring, "Hooray, {recipient}!" in cherry script above "{sender} sent you a sweet". A sunburst of butter (#F7E8A4) and cream rays (5° each) sits behind the sweet on arrival and unwrap, centred on the sweet and fading out with a radial mask. The unwrap button is now a cherry-red (#C8443F) pill with cream text and a butter inner ring, reading "Unwrap your sweet". It uses the same hover, pressed and focus behaviour as the primary button. See explorations/Arrival Celebration Options, 2c.
