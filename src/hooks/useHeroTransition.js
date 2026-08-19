import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE } from '../lib/motion.js';

/**
 * The hero's exit — one scrubbed gesture.
 *
 * Scrolling out of the hero does two things on a single timeline:
 *
 *   1. the type clears — it rises and fades, finishing well before the
 *      section is gone, so the words leave rather than getting cut off;
 *   2. the ground goes down — a warm-black wash rises over the cream,
 *      carrying the hero into the dark Work section beneath it.
 *
 * Without the second beat the cream hero would cut straight to the dark
 * section rather than falling into it.
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
 * @param {import('react').RefObject<HTMLElement>} refs.deepenRef
 */
export function useHeroTransition({ sectionRef, textRef, deepenRef }) {
  const { allowMotion } = useMotion();

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

      // 1 — The words leave first, and finish well before the wash does.
      if (textRef.current) {
        timeline.to(
          textRef.current,
          { yPercent: -14, opacity: 0, ease: GSAP_EASE.standard, duration: 0.62 },
          0
        );
      }

      // 2 — The ground goes down. Held back slightly so the type is already
      //     clearing before it starts to darken.
      if (deepenRef.current) {
        timeline.to(deepenRef.current, { opacity: 1, duration: 0.78 }, 0.12);
      }

      teardown = () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        for (const ref of [textRef, deepenRef]) {
          if (ref.current) gsap.set(ref.current, { clearProps: 'all' });
        }
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [sectionRef, textRef, deepenRef, allowMotion]);
}
