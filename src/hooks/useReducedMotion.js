import { useMediaQuery } from './useMediaQuery.js';

/**
 * Tracks the visitor's motion preference.
 *
 * The server snapshot is `true` — no motion. Prerendered HTML is never built
 * around animation the visitor may not want, and capability is granted only
 * after the browser has been asked.
 *
 * @returns {boolean} true when motion should be suppressed
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)', true);
}
