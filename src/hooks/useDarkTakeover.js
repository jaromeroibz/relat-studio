import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';

// The share of About's exit the curtain takes to reach the top; it then holds,
// fully covering, while About scrolls away beneath it.
const RISE_SHARE = 0.65;

/**
 * About's exit into Start a Project — one black curtain.
 *
 * The curtain is a fixed, viewport-sized layer, independent of About's height
 * and of Start a Project's (see about-curtain.css). Scrubbed over About's last
 * screen of scroll (`bottom bottom` → `bottom top`):
 *
 *   0 → 65%   it rises from the bottom edge to cover the whole viewport,
 *             ahead of Start a Project's own edge entering behind it
 *   65 → 100% it holds, fully covering, while About scrolls off beneath it
 *   100%      it is hidden — About is off-screen and Start a Project, already
 *             the same black, fills the viewport: no visible change
 *
 * Moving it is the only animation in the transition. Reverse scroll runs the
 * same timeline backwards: the curtain reappears full, then descends,
 * uncovering About.
 *
 * GSAP owns the curtain's transform from a clean slate (`gsap.set`), never a
 * CSS-authored one — see the same note in useWordmarkPresence.
 *
 * @param {object} refs
 * @param {import('react').RefObject<HTMLElement>} refs.sectionRef About.
 * @param {import('react').RefObject<HTMLElement>} refs.curtainRef
 */
export function useDarkTakeover({ sectionRef, curtainRef }) {
  const { allowMotion } = useMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const curtain = curtainRef.current;
    if (!section || !curtain || !allowMotion) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      gsap.set(curtain, { yPercent: 100, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.set(curtain, { autoAlpha: 1 }, 0);
      tl.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: RISE_SHARE }, 0);
      tl.set(curtain, { autoAlpha: 0 }, 1);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
        animation: tl,
      });

      teardown = () => {
        trigger.kill();
        tl.kill();
        gsap.set(curtain, { clearProps: 'all' });
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [sectionRef, curtainRef, allowMotion]);
}
