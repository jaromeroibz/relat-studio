# RELAT — Logo Usage

Formalized from the site's existing, approved marks (`src/components/hero/Hero.jsx` + `src/styles/signature.css` for the wordmark; `public/favicon.ico` for the compact mark). No new symbol, no redesign — see `public/brand/` for the files.

## Primary mark

RELAT + STUDIO wordmark (`relat-wordmark-*.svg` / `.png`). STUDIO rides RELAT's top-right corner, exactly as it does in the live site's persistent signature.

## Compact mark

The R (`relat-mark-*.svg`), taken from the existing favicon. STUDIO is dropped — at compact sizes it isn't legible, so showing it would be the mark asserting detail it can't actually deliver there.

## Recommended use

| Context | Use |
| --- | --- |
| Website, presentations, proposals, documents | Primary wordmark |
| Favicon, app/profile icon, any small or square space | Compact mark |
| Google Business Profile / avatar uploads | `relat-google-profile-*.svg` / `.png` (compact mark, pre-composed on a 1:1 canvas) |

## Clear space

Keep clear space around the mark of at least the height of the **R** in RELAT (the primary wordmark's cap-height) on every side. It's the one measurement already built into the mark itself, so it scales correctly with it automatically.

## Minimum size

- **Wordmark:** don't go below roughly 120px wide on screen — STUDIO is already small relative to RELAT, and below this it stops reading as a word.
- **Compact mark:** legible down to 32px (favicon size); tested and clear at that size.

## Background use

- **White or cream backgrounds:** `relat-wordmark-black.svg` / `relat-mark-black.svg`.
- **The site's own warm cream (`--paper-100`, `#F3EFE9`) as a background, e.g. a dark theme surface:** the **cream** variant is for the mark appearing *on dark*, not as a background itself — use `relat-wordmark-cream.svg` / `relat-mark-cream.svg` on black or near-black (`--ink-900`, `#100E0C`) grounds.
- **Any other dark or photographic background:** `relat-wordmark-white.svg` / `relat-mark-white.svg`. Pure white (`#FFFFFF`) isn't one of RELAT's own palette tokens — the brand's real "light-on-dark" color is the cream above — but a true white is kept as a practical option for grounds the cream doesn't sit cleanly on (e.g. a busy photo).
