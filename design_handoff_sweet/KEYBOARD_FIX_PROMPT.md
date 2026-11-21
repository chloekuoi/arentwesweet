# Fix prompt for Claude Code: Note screen (phone) — layout 4a + typing mode 3a

Still broken on device: when a field is focused, the card picker and Back / Next are still showing, and the keyboard covers the buttons. The typing mode below was not applied. Please implement it fully this time.

References:
- design_handoff_sweet/reference/Note Keyboard Options.dc.html → options **4a** (resting layout) and **3a** (typing layout)
- design_handoff_sweet/reference/SweetPhone.dc.html → screens `s3` (resting) and `s3k` (typing); also check device="se"

Only change S3. Leave everything else as it is.

## Resting layout (4a, keyboard closed)
- Size the layout to the visible browser area (`100dvh`), not the full screen. In Chrome iOS or the Instagram browser, that's about 730px tall on a 390×844 phone.
- From top to bottom: stepper, card preview, then the bottom sheet.
- Card preview: 250px wide, 170px tall (heart card 194px), centered, rotated -1.5deg, showing live To / message / From.
- Sheet: starts about 34px below the card and runs to the bottom. Inside it: "Write your note", the 4-card picker (46px tiles), To / From side by side (44px tall), Message (72px tall), and Back / Next pinned 26px from the bottom.
- On short screens (iPhone SE), shrink the card preview first, then the picker tiles (down to 44px tall). Never let the sheet scroll Back / Next out of view.

## Typing mode (3a, any S3 field focused)
- Hide: the stepper, card preview, card picker and Back / Next. Use `display:none`, not just hidden visually.
- The sheet fills the visible area: from the top of the visual viewport + 8px down to the top of the keyboard. That's above iOS's autofill strip (the key / card / location bar) as well.
- Header row: "Write your note" on the left, and a "Done" text button on the right (IM Fell italic 19px, underlined, 44px hit area). Done blurs the field and returns to the resting layout.
- To / From stay side by side. Message fills the remaining height (at least 72px) and scrolls internally.
- All inputs use 16px text, so iOS doesn't zoom in.

## Implementation
- Detect typing with `focusin` / `focusout` on the S3 root. Debounce `focusout` about 100ms so moving from To to From doesn't flicker.
- Keyboard size: read `window.visualViewport`. Set the sheet's `height` to `visualViewport.height - 8` and `transform: translateY(visualViewport.offsetTop + 8px)`. Update on `visualViewport` `resize` and `scroll`. Never use `100vh` or `window.innerHeight` for this.
- App root: `position:fixed; inset:0; height:100dvh; overflow:hidden`. The body never scrolls.
- Viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content`.
- Transitions: hidden parts fade over 150ms, and the sheet moves over 220ms ease-out. Respect `prefers-reduced-motion`.

## Test checklist
Run each in iPhone Safari, Chrome iOS and the Instagram in-app browser, at standard and SE sizes:
1. Tap To: typing mode shows, and the picker, preview and Back / Next are gone.
2. Type, then move To → From → Message: nothing jumps and nothing is covered.
3. Tap Done: you're back on 4a, the preview shows the typed text, and Next is visible.
4. Rotate the phone, and do a long 280-character message.
