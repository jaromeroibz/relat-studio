import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE } from '../lib/motion.js';

export const CTA_EASE = GSAP_EASE.outExpo;

// Mirrors useDarkTakeover: the curtain covers the viewport over the first 65%
// of About's exit (its bottom edge travelling from the bottom of the viewport
// to 35% from the top), then holds until About is off-screen.
const CURTAIN_RISE_SHARE = 0.65;
// How far the entrance lags the scroll it is tied to (seconds to catch up) —
// the same smoothing the Statement uses, so a flick can't snap through it.
const SCRUB_S = 0.6;

/**
 * One group of the Start a Project / Contact entrance, tied to the black
 * curtain rather than played after it.
 *
 * The curtain (useDarkTakeover) is a fixed layer over everything, and this
 * content lives *under* it in the page — so waiting for the curtain to finish
 * meant a long empty black screen. Instead the content sits above the curtain
 * (`z-[70]`, see PosterCTA / ContactCTA) and is revealed by a scrubbed
 * timeline that starts while the curtain is still rising. That is always
 * safe: the content is part of the sections *below* About, so it can only
 * ever be at or below About's bottom edge — and the curtain's top edge is
 * always above that edge — meaning anything revealed here is over black,
 * never over the cream of About.
 *
 * Each group starts at the later of:
 *   - the curtain reaching `curtainAt` (0–1 of its rise), and
 *   - the group's own top reaching 90% of the way down the viewport — so on a
 *     phone, where the form is a screen below, it enters when you get to it
 * and plays over `length` × the viewport height of scroll.
 *
 * Scrubbed with a numeric `scrub`: slow scroll follows directly, a fast flick
 * catches up smoothly, and reverse scroll unwinds the same timeline. No hidden
 * state exists unless this runs, so no-JS and reduced-motion visitors see the
 * finished content on the black ground.
 *
 * @param {object} params
 * @param {import('react').RefObject<HTMLElement>} params.groupRef An
 *   un-transformed wrapper, used to measure when the group comes into view.
 * @param {(gsap: import('gsap').gsap, group: HTMLElement) => import('gsap').core.Timeline} params.build
 *   Sets the group's hidden states and returns its timeline.
 * @param {number} params.curtainAt Curtain progress (0–1) at which this group may start.
 * @param {number} params.length Scroll distance of the entrance, in viewport heights.
 */
export function useCtaReveal({ groupRef, build, curtainAt, length }) {
  const { allowMotion } = useMotion();

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !allowMotion) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const timeline = build(gsap, group);

        // Layout position, summed through offsetParents: independent of the
        // current scroll (ScrollTrigger moves it while it measures) and of
        // any transform on the element or an ancestor.
        const pageTop = (el) => {
          let top = 0;
          for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
          return top;
        };

        const startAt = () => {
          const vh = window.innerHeight;
          const about = document.getElementById('about');
          // Scroll position at which About's bottom edge is at the very
          // bottom of the viewport — the curtain's progress 0.
          const curtainZero = about ? pageTop(about) + about.offsetHeight - vh : 0;
          const curtain = curtainZero + curtainAt * CURTAIN_RISE_SHARE * vh;
          return Math.max(curtain, pageTop(group) - 0.9 * vh);
        };

        ScrollTrigger.create({
          trigger: group,
          start: startAt,
          end: () => startAt() + length * window.innerHeight,
          scrub: SCRUB_S,
          animation: timeline,
          invalidateOnRefresh: true,
        });
      }, group);

      teardown = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [groupRef, allowMotion, build, curtainAt, length]);
}
