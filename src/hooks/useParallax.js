import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';

/**
 * Scroll-linked translation on a single element.
 *
 * GSAP is imported dynamically and only when parallax is actually permitted,
 * so a phone or a reduced-motion visitor never downloads it for this.
 * ScrollTrigger is already synced to Lenis in SmoothScroll.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {{ distance?: number, scale?: number }} [options]
 *   distance — pixels travelled across the element's full scroll range.
 */
export function useParallax(ref, { distance = 80, scale = 1 } = {}) {
  const { allowParallax } = useMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !allowParallax) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.fromTo(
        element,
        { yPercent: 0, scale },
        {
          yPercent: (distance / element.offsetHeight) * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      teardown = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(element, { clearProps: 'transform' });
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [ref, allowParallax, distance, scale]);
}
