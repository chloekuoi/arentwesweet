# Fix prompt for Claude Code: Note screen when the keyboard is open (phone)

Bug: on iPhone Safari, focusing To / From / Message on S3 makes the page scroll under the pinned stepper. The stepper then draws over the card picker labels ("Heart", "Airmail"…). This is a layout bug, not the network.

Reference: design_handoff_sweet/reference/SweetPhone.dc.html, screen `s3k` (also try device="se"). Change only the S3 typing state; leave everything else as it is.

## Typing mode (any S3 field focused, phone only)
- Hide the stepper and the card stage preview. The sheet fills the visible area: top = safe-area top + 8px, bottom = top of the keyboard.
- Header row: "Write your note" on the left, a "Done" text button on the right (IM Fell italic 19px, underlined, 44px hit area). Done blurs the active field and returns to the normal S3 layout.
- Hide the card-style picker and the Back / Next buttons while typing.
- To / From stay in a 2-column row. Message textarea grows to fill the rest of the sheet (min 72px) and scrolls internally.
- Inputs and the textarea use font-size 16px, so iOS doesn't zoom on focus.

## Implementation
- Detect typing with `focusin` / `focusout` on the S3 sheet (debounce `focusout` ~100ms so tabbing To → From doesn't flicker).
- Size the sheet from `window.visualViewport`: `height = visualViewport.height`, `transform: translateY(visualViewport.offsetTop)`. Update it on `visualViewport` `resize` and `scroll`. Don't size it from `100vh`.
- The app root should be `position: fixed; inset: 0; height: 100dvh; overflow: hidden`. Only the sheet scrolls. The body should never scroll, so iOS can't push the stepper over content.
- Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">`.
- Transition: the stepper and preview fade out over 150ms, and the sheet slides to its new top over 220ms ease-out. Respect `prefers-reduced-motion`.

Test on iPhone Safari (standard and SE size) and inside the Instagram in-app browser: focus each field, type, switch fields, rotate, tap Done.
