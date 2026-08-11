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
 * Resolved by measuring, not by parsing. The computed value of a custom
 * property is its token sequence — `--nav-height` reads back as
 * "clamp(3.75rem, 5vw, 5rem)", which parseFloat turns into NaN. A throwaway
 * element lets the browser do the arithmetic it is already doing for layout.
 */
export function getNavHeight() {
  if (typeof window === 'undefined') return 0;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;height:var(--nav-height)';
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height;
}
