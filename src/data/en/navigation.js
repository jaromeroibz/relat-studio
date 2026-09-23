/**
 * Navigation — English.
 *
 * Four items, deliberately. See docs/E-brand-constitution.md §17.
 */

/**
 * RELAT reads as one homepage narrative, so navigation points at chapters of
 * it rather than at standalone pages. `/work` is the exception — the portfolio
 * index is a real route because project stories live under it.
 *
 * The single source for both the fixed nav and the footer (Footer.jsx reads
 * this directly, not a separate copy) — one array to edit, so the two can't
 * drift into linking the same word to different places again.
 */
export const primaryNav = [
  { label: 'Work', to: '/#work' },
  { label: 'Capabilities', to: '/#capabilities' },
  { label: 'About', to: '/#about' },
  // `longLabel` is the desktop-row treatment at `lg` and above, where there is
  // room for it. Everywhere narrower — the tablet-width nav row, the full
  // mobile overlay, and the footer — falls back to `label`, which stays this
  // site's own navigation voice rather than a CTA button wearing a nav's
  // clothes.
  { label: 'Contact', longLabel: 'Start a project →', to: '/#contact' },
];
