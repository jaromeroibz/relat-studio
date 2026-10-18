import { GSAP_EASE } from './motion.js';

/**
 * The letter-by-letter reveal shared by the Hero's opening wordmark and the
 * brand statement's RELAT: every letter already exists in its own
 * overflow-hidden mask and rises into place, left to right — never typed, no
 * scramble, no bounce. One definition, so the two moments always rhyme.
 */
export const LETTER_STAGGER_S = 0.055;
export const LETTER_DURATION_S = 0.55;

/**
 * GSAP `to()` vars that play the reveal on a set of letters.
 *
 * Always pass a copy — `{ ...LETTER_REVEAL_VARS }` — never this object itself:
 * GSAP writes `parent` (the timeline the tween joins) onto whatever vars object
 * it is given. Shared between two animations, the first timeline to use it
 * silently becomes the second tween's parent. Frozen so that mistake throws
 * instead of quietly stalling an animation.
 */
export const LETTER_REVEAL_VARS = Object.freeze({
  yPercent: 0,
  opacity: 1,
  duration: LETTER_DURATION_S,
  ease: GSAP_EASE.outExpo,
  stagger: LETTER_STAGGER_S,
});
