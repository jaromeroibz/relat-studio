import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE } from '../lib/motion.js';

/**
 * The hero's exit — one scrubbed gesture, not several effects that happen to
 * overlap.
 *
 * Scrolling out of the hero does three things on a single timeline:
 *
 *   1. the editorial layer clears — type rises and fades first, so the words
 *      leave before the image takes over rather than fighting it;
 *   2. the image takes the frame — the panel's left edge opens across the
 *      viewport, revealing more of the same photograph instead of swapping to
 *      a different picture;
 *   3. the light blooms — a warm wash lifts as the frame fills, which is the
 *      studio's light motif carrying the handoff.
 *
 * The theme change is deliberately *not* scripted here. ThemeController already
 * flips the document to dark when the following section crosses the viewport
 * centre, which lands at roughly the midpoint of this timeline. Aligning to it
 * rather than duplicating it keeps one source of truth for the background and
 * means the navigation's colour and the darkening can never disagree.
 *
 * Everything is transform, opacity and a single clip-path. Nothing here reads
 * layout during scroll.
 *
 * @param {object} refs
 * @param {import('react').RefObject<HTMLElement>} refs.sectionRef Trigger.
 * @param {import('react').RefObject<HTMLElement>} refs.textRef
 * @param {import('react').RefObject<HTMLElement>} refs.mediaRef  Clipped frame.
 * @param {import('react').RefObject<HTMLElement>} refs.innerRef  Drifting image.
 * @param {import('react').RefObject<HTMLElement>} refs.lightRef  Warm wash.
 */
export function useHeroTransition({ sectionRef, textRef, mediaRef, innerRef, lightRef }) {
  const { allowMotion, allowParallax } = useMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !allowMotion) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 1 — The words leave first, and finish well before the frame does.
      if (textRef.current) {
        timeline.to(
          textRef.current,
          { yPercent: -14, opacity: 0, ease: GSAP_EASE.standard, duration: 0.62 },
          0
        );
      }

      // 2 — The frame opens. Desktop only: below `lg` the media is already
      //     full width, so there is nothing to open.
      if (allowParallax && mediaRef.current) {
        timeline.fromTo(
          mediaRef.current,
          { '--hero-clip': '58.333%' },
          { '--hero-clip': '0%', duration: 0.8 },
          0
        );
      }

      // The image drifts against the scroll throughout, at both sizes.
      if (innerRef.current) {
        timeline.to(innerRef.current, { yPercent: 8, duration: 1 }, 0);
      }

      // 3 — Warm light lifts as the frame fills.
      if (lightRef.current) {
        timeline.fromTo(
          lightRef.current,
          { opacity: 0, scale: 1.15 },
          { opacity: 1, scale: 1, duration: 0.85 },
          0.05
        );
      }

      teardown = () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        for (const ref of [textRef, mediaRef, innerRef, lightRef]) {
          if (ref.current) gsap.set(ref.current, { clearProps: 'all' });
        }
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [sectionRef, textRef, mediaRef, innerRef, lightRef, allowMotion, allowParallax]);
}
