# Sweet

Wrap a virtual vintage candy and send it to a friend as a link. The sender picks a paper, ribbon and name sticker, writes a note, and can add an extra: a link or an IOU. The receiver opens the link, clicks or taps to unwrap, and reads the note.

Built from the Claude Design handoff in [`design_handoff_sweet/`](design_handoff_sweet/README.md). That README is the spec, and the prototypes in `design_handoff_sweet/reference/` are the visual reference.

## Run it

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL to your public origin
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` runs the production build. Sweets are stored in SQLite at `./data/sweets.db`, and link-preview PNGs go to `./data/og/`. Set `SWEET_DATA_DIR` to put them somewhere else. The deploy target needs a writable disk.

## Routes

| Route | What it does |
|---|---|
| `/` | Sender flow S1–S5 with client state. Includes "Preview as Mia sees it", which shows the real receiver page with the preview bar on top. |
| `/g/[id]` | Receiver: R0 fetching, R1 arrival, unwrap, R4 reveal, R5 not found (404), and the load error (network or 5xx). |
| `POST /api/sweets` | Validates and stores a sweet. Returns `{ id }`, a 12-character random base62 id. |
| `GET /api/sweets/[id]` | Returns the sweet, or 404. There is no listing endpoint. |
| `/g/[id]/opengraph-image` | 1200 × 630 link preview (option 7a), rendered with resvg when the sweet is created. |

`og:title` is "{from} sent you a sweet 🎀". `og:description` is "Something's wrapped for {to}. Tap to unwrap it." The note, link and IOU never go into the metadata.

## Layout

- **Under 900px wide:** phone layout. A 390-wide design is scaled to the device width, with a shorter "SE" variant under about 784 design-px tall.
- **900px and wider:** laptop layout. The stage sits on the left with a 580 / 500 / 440px panel on the right (60 / 40 at 1440). Above 1920 × 1200 the whole canvas scales up; from 900–1023 wide or under 720 tall it scales down.
- **Keyboard (laptop):** Tab and Enter/Space work on every control. Enter alone goes to the next step, Esc goes back or leaves a text field, and M toggles sound. Focus rings show only for keyboard users (`:focus-visible`).

## Code map

- `lib/art/sweet-candy.ts`, `box.ts`, `doily.ts`: the illustration engine, ported as-is. Only the IIFE wrapper and `window.*` globals were changed. `lib/art/index.ts` adds types on top.
- `components/art.tsx`: memoized `<Candy>`, `<CandyPiece>`, `<Tray>`, `<FabricSwatch>`, `<RibbonSwatch>`, `<Sticker>`, `<NoteCard>` and `<Confetti>`.
- `components/ui.tsx` and `styles/ui.module.css`: buttons (primary, secondary, link), tiles, fields, step bar, wax seal, IOU coupon and mute button, with their hover, pressed and focus states.
- `lib/layout.ts`: the panel widths, scaling and phone geometry from the prototypes.
- `components/sender/*` and `components/receiver/*`: the laptop and phone screens and their state hooks.
- `lib/store.ts` (SQLite), `lib/og.ts` (link preview), `lib/sound.ts` (sound hooks).

## Still to come

- **Sound files.** `playSound(cue)` in `lib/sound.ts` is a silent no-op, and the unwrap cue sheet is already wired up. Add the 6 files and load them there. Mute is saved in `localStorage['sweet.muted']`.
- **Product details that weren't designed:** domain, link expiry, abuse reporting, analytics.
- **resvg note:** resvg crashes (a Rust panic) on the pen-jitter filter's large user-space filter region. `lib/og.ts` swaps that region for a bounding-box one at rasterization time only. The drawing code isn't changed.
