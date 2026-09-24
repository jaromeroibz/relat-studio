import { useEffect, useLayoutEffect, useRef } from 'react';
import { GSAP_EASE, seconds } from '../lib/motion.js';
import { LETTER_REVEAL_VARS } from '../lib/letterReveal.js';
import { getLenis } from '../lib/scroll.js';

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

// Every native path that can move `window.scrollY` on a key press. Space
// is `' '` in every current browser; the once-common `'Spacebar'`/`'Down'`
// legacy `key` values belong to browsers this site doesn't target.
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);

// `overflow: hidden` (below) is necessary but was, on its own, not
// sufficient — confirmed by instrumenting an actual fresh load rather than
// trusting the CSS: keyboard scrolling moved the page a few pixels even
// with both `html` and `body` locked, because a key press's *default
// action* is decided by the browser before it ever consults overflow —
// overflow only stops the *result* (the scrollable range collapses to
// nothing), not the browser from attempting the scroll in the first place,
// and on some paths a couple of pixels of that attempt still land before
// the range clamps it back. `wheel`/`touchmove`/the scroll-key subset of
// `keydown` are the only events whose *default action itself* is "scroll
// the page" — capturing and cancelling those directly is what actually
// stops it at the source, rather than trying to clean up after. Registered
// only for the span the intro lock is active, at `window`, capture phase
// (ahead of Lenis's own bubble-phase listeners and anything else on the
// page) so `preventDefault` reliably wins; never `stopPropagation`, so
// Lenis's own (redundant but harmless) `isStopped` check, and everything
// else's normal handling of the same event, still runs.
let lockTeardown = null;

// The same technique the mobile menu already locks scroll with (Nav.jsx) —
// not `position: fixed` on anything, which the brief specifically rules
// out: it would take the Hero out of flow, collapsing the space Work et al.
// sit in below it, and reintroduce it (with whatever it measures *then*) on
// unlock. `overflow: hidden` changes nothing about document geometry, and is
// set on `documentElement` as well as `body`, not body alone: `document.
// scrollingElement` — the box a keyboard Space/PageDown/arrow actually
// scrolls — is `<html>` whenever body has no overflow rule making body
// itself the scroller, which is this page's normal state.
const lockScroll = () => {
  if (lockTeardown) return; // already locked — idempotent
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  const lenis = getLenis();
  lenis?.stop();
  // Pins Lenis's own idea of scroll to 0 too, so a stopped instance has
  // nothing "queued" to snap to if something resumes it unexpectedly.
  lenis?.scrollTo(0, { immediate: true, force: true });

  // `stopImmediatePropagation` here specifically (never below, for keydown):
  // Lenis's own wheel/touch listener is a *separate* one on the same event,
  // and `preventDefault` alone doesn't stop it from also running — it only
  // cancels the browser's native scroll, not Lenis's independent, explicit
  // `scrollTo` in response to the delta it would otherwise still read from
  // this same event. That matters because Lenis's instance is created by
  // SmoothScroll's own effect, asynchronously, and may not exist yet — or
  // may exist but not yet be `stop()`-ed — at the exact moment this lock
  // engages; stopping propagation means it never sees the event at all
  // while locked, regardless of which of those is true. Wheel/touch have no
  // other legitimate listener this could break, unlike keydown (Escape,
  // Tab, focus), which is why the split is deliberate.
  const blockScrollGesture = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const blockScrollKey = (event) => {
    if (SCROLL_KEYS.has(event.key)) event.preventDefault();
  };
  // Belt-and-suspenders beneath the two blockers above: not the primary
  // mechanism (the brief is explicit that it shouldn't be), but a real
  // native path this hook hasn't enumerated — a mouse "scroll" button, a
  // screen-reader's own navigation commands, anything — still can't leave
  // `scrollY` anywhere but 0 while this is watching.
  const snapBackTo0 = () => {
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  };

  window.addEventListener('wheel', blockScrollGesture, { passive: false, capture: true });
  window.addEventListener('touchmove', blockScrollGesture, { passive: false, capture: true });
  window.addEventListener('keydown', blockScrollKey, { capture: true });
  window.addEventListener('scroll', snapBackTo0, { passive: true });

  lockTeardown = () => {
    window.removeEventListener('wheel', blockScrollGesture, { capture: true });
    window.removeEventListener('touchmove', blockScrollGesture, { capture: true });
    window.removeEventListener('keydown', blockScrollKey, { capture: true });
    window.removeEventListener('scroll', snapBackTo0);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };
};

const unlockScroll = () => {
  lockTeardown?.();
  lockTeardown = null;

  const lenis = getLenis();
  if (!lenis) return;
  // `window.scrollY` is guaranteed 0 here (nothing above ever let it move),
  // so this is a resync, not a jump: whatever Lenis's own `targetScroll`
  // was left holding from before `stop()` — including anything the
  // now-removed blockers kept it from ever reaching — is explicitly
  // overwritten first, so `start()` has no leftover target/velocity to
  // lurch toward on the very next tick. The first wheel after this behaves
  // like a fresh scroll, not a resumed one.
  lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis.start();
};

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
 * Scroll stays locked (`lockScroll`/`unlockScroll` above) for the entire
 * span above — engaged right as this branch is chosen, released only
 * inside `settle()`, the one point every path (this full sequence, and
 * every skip below) funnels into. Never `position: fixed`: that would
 * pull the Hero out of flow for however long the intro runs, and the brief
 * explicitly rules that out.
 *
 * The decision itself, and `lockScroll()` if it locks, run in a
 * `useLayoutEffect`, not the plain `useEffect` this used to be. A passive
 * effect is scheduled to run *after* the browser has already painted the
 * commit that produced it — there is a real, observable gap between "the
 * Hero's hidden-by-default markup is now on screen" and "the effect
 * deciding whether to lock has even run", and a wheel/key/touch landing in
 * exactly that gap reached a page with nothing yet stopping it. A layout
 * effect is flushed synchronously as part of the same commit, before that
 * paint — the lock is either already in place or was never going to
 * engage (reduced motion, a landing hash, a settled return) by the time
 * anything is on screen to interact with.
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

  useLayoutEffect(() => {
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
      // The single completion point every path below funnels into —
      // reduced motion, already-scrolled, already-settled, and the real
      // cold intro finishing all call this and only this. Releasing the
      // lock here rather than at any of the intro's intermediate beats
      // (split done, headline in, links in) is what "unlock only once
      // everything is settled" actually means; harmless to call when
      // nothing was ever locked (skip branches below), since both
      // `unlockScroll` steps are no-ops in that case.
      unlockScroll();
      onSettleRef.current?.();
    };

    // Reduced motion, a page that loaded already scrolled past the hero
    // (refresh / restored scroll), a landing hash (`/#work` etc. — nothing
    // has scrolled there yet at this exact instant, useHashScroll's own
    // effect runs after this one, but the intent to leave Hero immediately
    // is already decided), or a mount that isn't this load's first — i.e.
    // Hero remounting because the user navigated back to `/` rather than
    // loading it fresh: settle immediately, no intro, no lock, at all.
    // The hash case specifically used to deadlock rather than merely skip
    // the opening: locking scroll here and *then* asking useHashScroll to
    // scroll to the target left it with nothing able to move, since
    // `overflow: hidden` refuses a programmatic `scrollTo` exactly as it
    // refuses a wheel — landing well short of the anchor instead of at it.
    // `js-motion` (set by the pre-paint script only when motion is allowed)
    // rather than `allowMotion`: the context still holds its conservative
    // hydration default on this effect's first run, which would wrongly
    // take this branch and reveal the persistent wordmark and nav mid-intro.
    const motionOk = document.documentElement.classList.contains('js-motion');
    if (!motionOk || window.scrollY > 4 || window.location.hash || settledThisSession) {
      settle();
      return;
    }

    // Only this path — the real cold intro — ever locks. Engaging it here,
    // ahead of the async work below (font loading, gsap's own dynamic
    // import), covers the whole timeline from the very first frame rather
    // than leaving a gap where the still-unrevealed intro could be scrolled
    // past before letter-reveal even starts.
    lockScroll();

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
      // Route away mid-intro (Hero unmounts on every route change — see
      // useHeroIntro's own module note above) and nothing else would ever
      // call `settle()` for this instance to release the lock through.
      // Always releasing it here, unconditionally, is what keeps a
      // never-finished intro from leaving the next route unscrollable.
      unlockScroll();
    };
  }, [wordmarkRef, introWordmarkRef, introSplitRef]);
}
