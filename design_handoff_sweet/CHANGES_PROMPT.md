# Update prompt for Claude Code (paste this one if the app is already built)

The Sweet design has three updates. The refreshed handoff is in ./design_handoff_sweet. Read the three "Update" notes in README.md, then compare against reference/SweetLaptop.dc.html and reference/SweetPhone.dc.html. Change only these three things; leave everything else as it is.

## 1. S1 Welcome card → "shop label"
- Outer card: cream #FBF0DA, 2px #783E19 border, radius 10, padding 8px (phone 6px), shadow 6px 6px 0 rgba(31,42,68,.22).
- Inner frame: 1.5px #783E19 border, radius 5. Padding is 24px 40px 28px on laptop and 18px 18px 20px on phone. Text is centred, with a 12px gap.
- "Sweet" (La Belle Aurore, 24px laptop, 21px phone) sits between two 1.5px rules (40px wide on laptop, 30px on phone) with a 14px gap.
- Title "Wrap a little something": unchanged size (44px laptop, 34px phone).
- Body copy: centred, max-width 420px on laptop.
- "Start wrapping" is the full-width primary button (unchanged).
- Laptop card stays 600px wide and centred.

## 2. R1 Arrival → sunburst and plaque
- **Sunburst:** Show on the arrival and unwrap screens only, behind the tray and sweet and above the polka dots.
  - Shape: a circle with `repeating-conic-gradient(#F7E8A4 0 5deg, #FCF7EF 5deg 10deg)`, masked with `radial-gradient(circle, #000 0 30%, transparent 62%)`.
  - Laptop: in 1440×900 stage coordinates, left 20, top −220, size 1400 (centred on the sweet). It scales with the stage.
  - Phone: left −185, top 90, size 760.
- **Plaque** (replaces the "{sender} sent you a sweet" pill):
  - Outer: a cream pill with a 2px border, 7px padding (phone 5px) and a 5px 5px 0 rgba(31,42,68,.2) shadow.
  - Inner: a 1.5px dashed #783E19 ring, radius 999. Padding is 16px 56px 20px on laptop and 9px 22px 11px on phone.
  - Line 1: "Hooray, {recipient}!", La Belle Aurore, 28px laptop / 19px phone, colour #C8443F.
  - Line 2: "{sender} sent you a sweet", IM Fell DW Pica, 40px laptop / 23px phone.
  - Both lines are single-line with an ellipsis. Phone max-width is 350px.
  - If there's no recipient name, it falls back to "you".
- **Unwrap button:** "Unwrap your sweet", replacing the "CLICK / TAP TO UNWRAP" label.
  - Shape: a cherry-red #C8443F pill with cream #FFF9EC text and a 2px #783E19 border. The inner ring is `inset 0 0 0 3px #C8443F, inset 0 0 0 4.5px #F3E08A` and the drop shadow is 3px 4px 0 #783E19.
  - Type: IM Fell italic, 26px on laptop (height 66, padding 0 52px) and 22px on phone (height 54, padding 0 34px).
  - Hover: background #D2564F, lift (−1px, −2px), shadow 4px 6px.
  - Pressed: translate (2px, 3px), shadow 1px 1px.
  - Focus: the same focus ring as PrimaryButton.
  - It still triggers the same unwrap action as clicking the sweet.

## 3. Photo extra (new)
- **Extra option:** a 4th row, **Photo** — "A snapshot to keep", under Nothing / Link / IOU. Phone list rows are now 36px tall (was 40) so the editor fits.
- **Editor (S4, "write on the print"):** an instant print on the left, rotated −2°. It's #FFF9EC with a 1.5px #783E19 border, 8px 8px 0 padding and a 0 3px 3px rgba(90,42,16,.2) shadow.
  - Photo area: square, 96px on phone (60px on short phones like the SE) and 190px on laptop (150 when the window is under 860px tall).
  - Empty: a 2px dashed rgba(120,62,25,.6) frame with a camera icon and "Tap to add" (phone) or "Choose or drop" (laptop), IM Fell italic.
  - The whole photo area is the file picker (`accept="image/*"`). On phone it opens the camera or library. On laptop you can click it or drop a file on it.
  - Caption: typed straight onto the white strip below the photo. La Belle Aurore, centred, no border, placeholder "write a caption…", max 24 characters. The strip is 30px tall on phone and 44px on laptop.
  - Right column: a hint ("Tap the print to take a photo or choose one." / "Click the print to choose a photo, or drag one onto it."; once a photo is added: "Write a caption on the white strip, just like a real print."), "Caption n/24", and Replace / Remove text links. Remove is #C8443F.
  - Validation: Wrap it up with no photo shows "Add a photo first, or pick Nothing." with the red ! dot.
- **Stage preview (S4):** the same print, taped to the card's top-right corner with pink washi tape (rgba(245,205,211,.85), dashed brown ends, −6°), rotated 7°. It shows the photo with `object-fit: cover` and the caption in handwriting.
- **Receiver (R4):** the print taped on and rotated 6°, rising with the card.
  - Phone: 172px wide, 154px photo, 17px caption. It sits above the card, aligned right, and overlaps the card's top by 40px.
  - Laptop: 300px wide, 270px photo, 26px caption, rotated 5°. It sits beside the card, overlapping the card's right edge by 16px. The card shifts left to make room, like the IOU.
  - The scattered wrapper pieces avoid it.
- **Data:** `extra: { type: 'photo'; imageUrl: string; caption: string /* ≤24 */ }`.
  - Upload when the sweet is wrapped. Resize to max 1600px, strip EXIF/location, and store as JPEG or WebP. Accept JPG, PNG and HEIC up to 10 MB.
  - Serve the photo only on the revealed card. Never put it in the link preview or OG metadata.
- **Reference screens:** phone s4 with extra="photo" and r4d; laptop s4 / r4 with extra="photo". Both flow boards have the new frames.

When done, open both prototypes at screen s1, r1, s4 (Photo) and r4d (phone) / r4 with Photo (laptop) and match spacing and colour.
