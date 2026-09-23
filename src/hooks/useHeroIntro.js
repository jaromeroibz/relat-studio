import { useEffect, useRef } from 'react';
import { GSAP_EASE, seconds } from '../lib/motion.js';
import { LETTER_REVEAL_VARS } from '../lib/letterReveal.js';

// The complete wordmark holds before it splits.
const HOLD_S = 1;
// The split: both halves travel the same distance, at the same speed, in
// opposite directions, and leave the viewport entirely. Symmetric in-out ease
// so the separation is *seen* (slow start, confident middle, controlled exit).
const SPLIT_S = 1.2;
const SPLIT_EASE = 'power2.inOut';
// Once the halves are gone: headline (t0) → links (t0 + LINKS_AFTER_HEADLINE_S,
// staggered in Hero.jsx) → persistent RELAT rises from below
// (links start + SIGNATURE_AFTER_LINKS_S).
const LINKS_AFTER_HEADLINE_S = 0.2;
const SIGNATURE_AFTER_LINKS_S = 0.3;
const SIGNATURE_RISE_S = 0.9;

// Both halves reach slightly past the centre line so anti-aliasing can never
// leave a hairline gap — identical pixels overlap, so the overlap is invisible.
const TOP_VISIBLE_PCT = 50.2;
const BOTTOM_START_PCT = 49.8;

// Width of the whole "RELAT STUDIO" phrase per unit of font-size, and the
// share of the viewport it should fill (~80vw), calibrated for this face.
const COMBINED_PHRASE_RATIO = 5.18;
const TARGET_PHRASE_FRACTION = 0.8;
const MAX_PHRASE_FRACTION = 0.9;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Module state, not component state: Hero unmounts and remounts on every
// route change (it lives inside the `/` route, not root.jsx), so a ref or
// piece of state on Hero itself can never distinguish "first time this
// session" from "returning" — both start a fresh mount with no memory of the
// last one. A real page load re-evaluates this module and resets it to
// `false`, which is exactly the boundary between the two cases this hook
// must tell apart: `initialIntro` (this load has never settled the Hero
// before → play the opening) vs `settledHero` (it already has, on some
// earlier mount this session → every later mount initializes straight into
// the settled pose, deterministically, regardless of scroll position or
// navigation type).
let settledThisSession = false;

/**
 * The Hero's opening: letters reveal → complete RELAT STUDIO holds (1s) →
 * exact horizontal split, both halves leaving the viewport → nav + headline →
 * links → the persistent RELAT + small STUDIO rises from below.
 *
 * Geometry: the split is computed from the *measured, rendered* wordmark
 * (`getBoundingClientRect()` after `document.fonts.ready`), never from the
 * viewport. Two clones are positioned at exactly that box (left/top/width/
 * height) and each masked to its own half of *that box* with `clip-path`, so
 * together they reconstruct the intact wordmark before either moves. The
 * halves are rigid: pure vertical translation, no scale, no type change.
 *
 * Hero content is held (`[data-intro-hold]`, hero.css) until the halves are
 * gone, then released in one tick; the delays between headline and links are
 * CSS-relative to that release, so they can never drift from the split.
 *
 * The persistent wordmark stays invisible until it is revealed, and the
 * presence hook only takes over its transform once that rise has finished.
 *
 * @param {object} refs
 * @param {import('react').RefObject<HTMLElement>} refs.wordmarkRef Persistent signature.
 * @param {import('react').RefObject<HTMLElement>} [refs.introWordmarkRef] Letter-masked wordmark.
 * @param {import('react').RefObject<HTMLElement>} [refs.introSplitRef] Empty host for the two clones.
 * @param {() => void} [refs.onSettle] Called exactly once.
 */
export function useHeroIntro({ wordmarkRef, introWordmarkRef, introSplitRef, onSettle }) {
  const onSettleRef = useRef(onSettle);
  useEffect(() => {
    onSettleRef.current = onSettle;
  });

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const introWordmark = introWordmarkRef?.current;
    const splitHost = introSplitRef?.current;
    const overlay = introWordmark?.parentElement;
    const nav = document.querySelector('[data-hero-intro-pending]');
    const hold = document.querySelector('[data-intro-hold]');
    if (!wordmark || !introWordmark || !splitHost || !overlay) return;

    const settle = () => {
      wordmark.dataset.introPending = 'false';
      if (nav) nav.dataset.heroIntroPending = 'false';
      if (hold) hold.dataset.introHold = 'false';
      settledThisSession = true;
      onSettleRef.current?.();
    };

    // Reduced motion, a page that loaded already scrolled past the hero
    // (refresh / restored scroll), or a mount that isn't this load's first —
    // i.e. Hero remounting because the user navigated back to `/` rather
    // than loading it fresh: settle immediately, no intro at all. `js-motion`
    // (set by the pre-paint script only when motion is allowed) rather than
    // `allowMotion`: the context still holds its conservative hydration
    // default on this effect's first run, which would wrongly take this
    // branch and reveal the persistent wordmark and nav mid-intro.
    const motionOk = document.documentElement.classList.contains('js-motion');
    if (!motionOk || window.scrollY > 4 || settledThisSession) {
      settle();
      return;
    }

    let cancelled = false;
    let activeTweens = [];

    (async () => {
      const [{ gsap }] = await Promise.all([import('gsap'), document.fonts.ready]);
      if (cancelled) return;

      const run = (target, vars) =>
        new Promise((resolve) => {
          const tween = gsap.to(target, { ...vars, onComplete: resolve });
          activeTweens.push(tween);
        });

      // ── 1. Letter reveal ────────────────────────────────────────────
      const phraseFontPx = Math.min(
        (window.innerWidth * TARGET_PHRASE_FRACTION) / COMBINED_PHRASE_RATIO,
        (window.innerWidth * MAX_PHRASE_FRACTION) / COMBINED_PHRASE_RATIO
      );
      const letters = introWordmark.querySelectorAll('.hero-intro-letter');
      gsap.set(introWordmark, { fontSize: phraseFontPx });
      gsap.set(letters, { yPercent: 100, opacity: 0 });
      gsap.set(overlay, { opacity: 1 });

      await run(letters, LETTER_REVEAL_VARS);
      if (cancelled) return;

      // ── 2. Hold the complete wordmark ───────────────────────────────
      await wait(HOLD_S * 1000);
      if (cancelled) return;

      // ── 3. Measure the real wordmark, build the two halves ──────────
      // All synchronous: the browser never paints an intermediate state.
      const rect = introWordmark.getBoundingClientRect();

      const makeHalf = (clipPath) => {
        const half = introWordmark.cloneNode(true);
        half.classList.add('hero-intro-split-half');
        Object.assign(half.style, {
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          clipPath,
        });
        return half;
      };
      const topHalf = makeHalf(`inset(0% 0% ${100 - TOP_VISIBLE_PCT}% 0%)`);
      const bottomHalf = makeHalf(`inset(${BOTTOM_START_PCT}% 0% 0% 0%)`);
      splitHost.append(topHalf, bottomHalf);

      // Swap: the intact original hides in the same tick the halves appear.
      gsap.set(introWordmark, { opacity: 0 });

      // ── 4. Split — same distance, duration and ease, opposite ways ──
      const travel =
        Math.max(
          rect.top + rect.height * (TOP_VISIBLE_PCT / 100),
          window.innerHeight - (rect.top + rect.height * (BOTTOM_START_PCT / 100))
        ) + 24;
      await Promise.all([
        run(topHalf, { y: -travel, duration: SPLIT_S, ease: SPLIT_EASE }),
        run(bottomHalf, { y: travel, duration: SPLIT_S, ease: SPLIT_EASE }),
      ]);
      if (cancelled) return;

      // ── 5. Both halves are gone — release the Hero ──────────────────
      gsap.set(overlay, { opacity: 0 });
      topHalf.remove();
      bottomHalf.remove();

      if (hold) hold.dataset.introHold = 'false';
      if (nav) {
        gsap.set(nav, { opacity: 0, y: -8 });
        nav.dataset.heroIntroPending = 'false';
        gsap.to(nav, {
          opacity: 1,
          y: 0,
          duration: seconds('base'),
          ease: GSAP_EASE.standard,
          // `nav` is the `<header>` itself — fixed-position, and the
          // containing block its own mobile menu overlay (`inset-0`, also
          // fixed) sizes itself against. GSAP's CSSPlugin always writes a
          // real `transform` even at `y: 0` (an identity matrix, never
          // `none`), and *any* non-`none` transform on an ancestor makes it
          // the containing block for a `position: fixed` descendant instead
          // of the viewport — so left uncleared, the menu overlay would
          // collapse to the header's own ~nav-height box the next time it
          // opens. Clearing it once the reveal is visually done (`y` is
          // already 0) restores `transform: none` with no visible change.
          onComplete: () => gsap.set(nav, { clearProps: 'transform' }),
        });
      }

      // ── 6. Persistent RELAT + small STUDIO rises from below ─────────
      // Placed fully below the viewport, revealed there (so it never flashes
      // in place), then carried up to exactly the `hero` presence state.
      const restHeight = wordmark.getBoundingClientRect().height;
      gsap.set(wordmark, { y: restHeight * 1.1 });
      wordmark.dataset.introPending = 'false';

      await wait((LINKS_AFTER_HEADLINE_S + SIGNATURE_AFTER_LINKS_S) * 1000);
      if (cancelled) return;

      await run(wordmark, { y: 0, duration: SIGNATURE_RISE_S, ease: GSAP_EASE.outExpo });
      if (cancelled) return;

      settle();
    })();

    return () => {
      cancelled = true;
      for (const tween of activeTweens) tween.kill();
      activeTweens = [];
      splitHost.replaceChildren();
    };
  }, [wordmarkRef, introWordmarkRef, introSplitRef]);
}
