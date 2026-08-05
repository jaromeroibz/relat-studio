import { useSyncExternalStore } from 'react';
import { getMotionTokens } from '../lib/motion.js';

const FALLBACK = {
  instant: 100,
  fast: 200,
  base: 320,
  slow: 560,
  slower: 900,
  reveal: 1100,
  theme: 700,
};

/** Motion tokens never change after load, so there is nothing to subscribe to. */
const subscribe = () => () => {};

/**
 * The durations defined in CSS, read back for use in React.
 *
 * `getMotionTokens` caches, so the snapshot reference is stable and
 * `useSyncExternalStore` will not loop.
 *
 * @returns {Record<string, number>} durations in milliseconds
 */
export function useMotionDurations() {
  return useSyncExternalStore(
    subscribe,
    () => getMotionTokens().durations,
    () => FALLBACK
  );
}
