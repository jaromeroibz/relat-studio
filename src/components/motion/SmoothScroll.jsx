import { useEffect } from 'react';
import { useMotion } from '../../lib/motion-context.js';
import { setLenis } from '../../lib/scroll.js';

/**
 * Lenis — smooth scrolling only.
 *
 * Division of labour (see CLAUDE.md): Lenis owns the *feel* of scrolling.
 * GSAP/ScrollTrigger owns scroll-driven *choreography*. They are wired
 * together here so ScrollTrigger reads Lenis's virtual position, but they
 * never animate the same thing.
 *
 * Lenis and GSAP are imported dynamically: neither belongs in the entry chunk,
 * and a visitor with reduced motion never downloads either.
 */
export function SmoothScroll() {
  const { allowMotion } = useMotion();

  useEffect(() => {
    if (!allowMotion) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch scrolling stays native: it performs better, respects platform
        // conventions, and matches the reduced-motion tier for small screens.
        syncTouch: false,
      });

      lenis.on('scroll', ScrollTrigger.update);
      // Anchor navigation drives the same scroller rather than a second one.
      setLenis(lenis);

      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      teardown = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        setLenis(null);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [allowMotion]);

  return null;
}
