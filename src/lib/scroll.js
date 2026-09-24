/**
 * A handle on the Lenis instance.
 *
 * SmoothScroll owns the lifecycle; anything that needs to *drive* the scroll —
 * anchor navigation, for now — reads it from here. A module variable rather
 * than context because there is exactly one scroller and it is not React
 * state: nothing re-renders when it changes.
 */

let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/**
 * Height of the fixed navigation, in pixels.
 *
 * Measures the real nav (`#site-nav`, Nav.jsx), not the `--nav-height`
 * token: that token is the *intended* reservation other layout (the Hero's
 * own top padding) budgets against, but the actual header is sized by its
 * content — a row of text plus `py-md` — and the two can disagree by a few
 * pixels at a given viewport width. Anchor navigation landing a heading
 * partly under the nav, or a few pixels further below it than intended,
 * is exactly that gap showing up. Measuring the element directly can never
 * drift from what's actually on screen. Falls back to the token-probe
 * technique only if the nav genuinely isn't in the DOM yet.
 */
export function getNavHeight() {
  if (typeof window === 'undefined') return 0;

  const nav = document.getElementById('site-nav');
  if (nav) return nav.getBoundingClientRect().height;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;height:var(--nav-height)';
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height;
}

/**
 * How far anchor navigation (`useHashScroll.js`) should land below the
 * fixed nav — the one number every `#work`/`#capabilities`/`#about`/
 * `#contact` link shares, rather than each guessing its own pixel value.
 *
 * `--space-md` (24px) past the nav's real measured height: enough that the
 * landed heading visibly clears the header rather than grazing it, without
 * reading as its own extra pause the way a full section gap would.
 */
export function getAnchorOffset() {
  if (typeof window === 'undefined') return 0;

  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:var(--space-md)';
  document.body.appendChild(probe);
  const breathingRoom = probe.getBoundingClientRect().height;
  probe.remove();

  return -(getNavHeight() + breathingRoom);
}
