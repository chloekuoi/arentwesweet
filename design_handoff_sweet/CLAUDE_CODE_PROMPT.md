# Prompt to paste into Claude Code

I'm building "Sweet", a web app where you wrap a virtual vintage candy and send it to a friend as a link. The full design handoff is in ./design_handoff_sweet. Read README.md first, then open the reference files it lists. They are HTML prototypes (design references, not production code).

Please:
1. Set up Next.js (App Router) + TypeScript. Use CSS Modules (or Tailwind, if you set tokens from the README exactly).
2. Port reference/sweet-candy.js, box.js and doily.js to TypeScript modules **without changing the drawing logic or numbers**. Wrap them in memoized React components (<Candy>, <Tray>, <FabricSwatch>, <RibbonSwatch>, <Sticker>, <NoteCard>, <Confetti>).
3. Build the design tokens and the shared UI (PrimaryButton, SecondaryButton, Tile, TextField, StepBar, PolkaBackground) from the README's token and button sections, including hover, pressed and keyboard-focus states.
4. Build the sender flow S1–S5 as one route (/) with client state. Make it responsive: phone layout under 900px, laptop layout (stage + 580px panel, plus the responsive rules) at 900px and up. Match SweetPhone.dc.html and SweetLaptop.dc.html.
5. Add POST /api/sweets (any simple store: SQLite/Prisma or Vercel KV) and the receiver route /g/[id] (R0 loading, R1 arrival, unwrap animation, R4 reveal with scattered pieces, R5 not found, load error), using the exact motion timings in the README.
6. Add preview mode (sender previews from S5 with the top bar), copy-link with its fallback, mute persisted in localStorage, and the "Open in Safari" nudge for in-app browsers.
7. Generate the per-sweet OG image (option 7a) as described, and set og:title / og:description.
8. Leave sound as no-op hooks (playSound('crinkle'), etc.) that I can fill in later.

Work screen by screen. After each screen, compare against the matching prototype screen (open the .dc.html in a browser and use its "screen" setting) and fix spacing, colour or type differences before moving on.
