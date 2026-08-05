import { createContext, useContext } from 'react';

/**
 * The motion capability contract, resolved once and read everywhere.
 *
 * Three tiers, in order of severity:
 *   1. `prefersReducedMotion` — the user asked for less. Everything stops.
 *   2. `canHover`             — a fine pointer exists. Gates hover and cursor work.
 *   3. `isDesktop`            — enough viewport for full choreography.
 *
 * Components must never call matchMedia themselves; they ask here so the whole
 * site agrees about what is allowed.
 */
export const MotionContext = createContext({
  prefersReducedMotion: true,
  canHover: false,
  isDesktop: false,
  allowMotion: false,
  allowHover: false,
  allowParallax: false,
  allowCursor: false,
});

/**
 * @returns {import('react').ContextType<typeof MotionContext>}
 */
export function useMotion() {
  return useContext(MotionContext);
}
