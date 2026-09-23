import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE, seconds } from '../lib/motion.js';

/**
 * The two presences the persistent signature has before it leaves, as deltas
 * from its resting CSS state (`y: 0, scale: 1` — the oversized, clipped
 * composition signature.css already authors).
 *
 * Sections opt in with `data-wordmark-state` (Hero.jsx, SelectedWork.jsx).
 */
const STATES = {
  hero: { scale: 1 },
  work: { scale: 0.9 },
};

const DEFAULT_STATE = 'hero';

// The exit: a plain downward leave — same scale, same colour, no fade.
const EXIT_S = 0.7;
const EXIT_EASE = GSAP_EASE.inOutQuart;
const RETURN_EASE = GSAP_EASE.outQuint;

// How far below the viewport the Statement's top edge is when the exit
// begins. The Statement's cream plate rises from the bottom edge — exactly
// where the signature lives — so the signature has to be gone before the
// plate arrives, with a beat of clean stage before the first word. 60% of a
// viewport is ~0.5s of ordinary scrolling, then the plate still has to cross
// the whole screen before the Statement's first word.
const EXIT_LEAD = '60%';

/**
 * The persistent signature's whole lifecycle: Hero → Work → leaves, for good.
 *
 * Two things only:
 *
 *   1. Hero and Work set its scale (an IntersectionObserver on
 *      `[data-wordmark-state]`, the same `-50%` centre-line technique
 *      ThemeController uses — exactly one section owns the centre at a time).
 *   2. One observer on the Statement (`[data-wordmark-exit]`) decides whether
 *      it has left. The Statement's top edge only ever moves up, so "top is
 *      above the exit line" stays true through Capabilities, About, Start a
 *      Project and Contact — nothing later can bring it back, and no later
 *      section needs a marker or an observer.
 *
 * Scrolling back above the exit line returns it (rising from below, into the
 * pose of the section it returns to), so backward scroll is symmetrical
 * rather than leaving the Work without its signature.
 *
 * Once it has fully left it is `visibility: hidden` — not merely offscreen —
 * so it is out of rendering for the rest of the page.
 *
 * Gated on `active`: this hook and useHeroIntro must never both hold a
 * transform on the same element (see that file), so it does nothing until the
 * intro reports itself settled.
 *
 * @param {object} params
 * @param {import('react').RefObject<HTMLElement>} params.wordmarkRef
 * @param {boolean} params.active Whether the opening intro has finished.
 */
export function useWordmarkPresence({ wordmarkRef, active }) {
  const { allowMotion, isDesktop } = useMotion();

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el || !active) return;

    const targets = document.querySelectorAll('[data-wordmark-state]');
    const exitMarker = document.querySelector('[data-wordmark-exit]');
    if (targets.length === 0) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;

      // Mobile gets the same shapes at a fraction of the travel.
      const damp = isDesktop ? 1 : 0.5;
      const poseFor = (name) => ({
        y: 0,
        scale: 1 + ((STATES[name] ?? STATES[DEFAULT_STATE]).scale - 1) * damp,
      });
      // Far enough that the whole lockup, including the STUDIO annotation
      // above it, is below the bottom edge.
      const belowViewport = () => el.offsetHeight * 1.4;

      let current = DEFAULT_STATE;
      let exited = false;

      const applyState = (name, { instant = false } = {}) => {
        if (!name || name === current) return;
        current = name;
        if (exited) return; // remembered, applied on return
        gsap.killTweensOf(el);
        if (instant || !allowMotion) gsap.set(el, poseFor(name));
        else gsap.to(el, { ...poseFor(name), duration: seconds('slower'), ease: GSAP_EASE.outExpo });
      };

      const setExited = (next, { instant = false } = {}) => {
        if (next === exited) return;
        exited = next;
        gsap.killTweensOf(el);

        if (next) {
          if (instant || !allowMotion) {
            gsap.set(el, { y: belowViewport(), visibility: 'hidden' });
            return;
          }
          gsap.to(el, {
            y: belowViewport(),
            duration: EXIT_S,
            ease: EXIT_EASE,
            onComplete: () => gsap.set(el, { visibility: 'hidden' }),
          });
          return;
        }

        // Returning: parked below, revealed there, then carried up.
        gsap.set(el, { y: belowViewport(), visibility: 'visible' });
        if (instant || !allowMotion) {
          gsap.set(el, poseFor(current));
        } else {
          gsap.to(el, { ...poseFor(current), duration: EXIT_S, ease: RETURN_EASE });
        }
      };

      const stateObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) applyState(entry.target.dataset.wordmarkState);
          }
        },
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      );
      for (const target of targets) stateObserver.observe(target);

      // The intro already left the element at the `hero` pose, so this is a
      // snap to the values it is already sitting at — never a jump.
      applyState(targets[0].dataset.wordmarkState ?? DEFAULT_STATE, { instant: true });

      let exitObserver = null;
      if (exitMarker) {
        let first = true;
        exitObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              // `rootBounds` includes the extended bottom margin: the marker's
              // top being above its bottom edge means the exit line has been
              // crossed — whether the marker is still on screen or long gone
              // above it.
              const crossed = entry.boundingClientRect.top < entry.rootBounds.bottom;
              // The very first callback describes where the page already is
              // (a refresh, a restored scroll, an anchor jump) — no motion.
              setExited(crossed, { instant: first });
              first = false;
            }
          },
          { rootMargin: `0px 0px ${EXIT_LEAD} 0px`, threshold: 0 }
        );
        exitObserver.observe(exitMarker);
      }

      teardown = () => {
        stateObserver.disconnect();
        exitObserver?.disconnect();
        gsap.killTweensOf(el);
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [wordmarkRef, active, allowMotion, isDesktop]);
}
