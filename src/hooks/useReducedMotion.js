import { useMediaQuery } from './useMediaQuery.js';

/**
 * Tracks the visitor's motion preference.
 *
 * The server snapshot is `true` — no motion. Prerendered HTML is never built
 * around animation the visitor may not want, and capability is granted only
 * after the browser has been asked.
 *
 * Also true when the pre-paint failsafe in root.jsx has switched motion off
 * (`data-motion-failsafe`), so a page whose scripts arrived late behaves the
 * way the failsafe left it rather than half-animating.
 *
 * @returns {boolean} true when motion should be suppressed
 */
export function useReducedMotion() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true);
  return (
    reduced ||
    (typeof document !== 'undefined' && document.documentElement.hasAttribute('data-motion-failsafe'))
  );
}
