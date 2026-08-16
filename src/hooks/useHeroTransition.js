import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE } from '../lib/motion.js';

/**
 * The hero's exit — one scrubbed gesture, not several effects that overlap.
 *
 * Scrolling out of the hero does two things on a single timeline:
 *
 *   1. the editorial layer clears — type rises and fades first, so the words
 *      leave before the field takes over rather than fighting it;
 *   2. the light goes down — the bloom drifts and settles while a warm-black
 *      wash rises through the field.
 *
 * That second beat replaces what the dark image panel used to do. Without it
 * the cream hero would cut straight to the dark Work section; with it, the
 * light in the hero is what carries you there. Pacing is unchanged: the type
 * clears at the same point in the scroll it always did.
 *
 * The theme change is deliberately not scripted. ThemeController already flips
 * the document to dark when the next section crosses the viewport centre,
 * which lands mid-timeline. Aligning to it rather than duplicating it keeps
 * one source of truth for the background.
 *
 * Everything is transform and opacity. Nothing reads layout during scroll.
 *
 * @param {object} refs
 * @param {import('react').RefObject<HTMLElement>} refs.sectionRef Trigger.
 * @param {import('react').RefObject<HTMLElement>} refs.textRef
 * @param {import('react').RefObject<HTMLElement>} refs.bloomRef
 * @param {import('react').RefObject<HTMLElement>} refs.sheenRef
 * @param {import('react').RefObject<HTMLElement>} refs.deepenRef
 */
export function useHeroTransition({
  sectionRef,
  textRef,
  bloomRef,
  sheenRef,
  deepenRef,
}) {
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

      // 1 — The words leave first, and finish well before the field does.
      if (textRef.current) {
        timeline.to(
          textRef.current,
          { yPercent: -14, opacity: 0, ease: GSAP_EASE.standard, duration: 0.62 },
          0
        );
      }

      // 2 — The light goes down. Held back slightly so the type is already
      //     clearing before the field starts to darken.
      if (deepenRef.current) {
        timeline.to(deepenRef.current, { opacity: 1, duration: 0.78 }, 0.12);
      }

      // The source settles as it dims — desktop only. On a phone the field is
      //     most of the screen and any drift during a scroll reads as a wobble.
      if (allowParallax) {
        if (bloomRef.current) {
          timeline.to(bloomRef.current, { yPercent: 9, scale: 1.05, duration: 1 }, 0);
        }
        if (sheenRef.current) {
          timeline.to(sheenRef.current, { yPercent: 16, opacity: 0.4, duration: 1 }, 0);
        }
      }

      teardown = () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        for (const ref of [textRef, bloomRef, sheenRef, deepenRef]) {
          if (ref.current) gsap.set(ref.current, { clearProps: 'all' });
        }
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [sectionRef, textRef, bloomRef, sheenRef, deepenRef, allowMotion, allowParallax]);
}
