import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE, seconds } from '../lib/motion.js';

/**
 * The Work feature's choreography — one consistent sequence for every
 * project's chapter (id/metadata, a centered statement, a centered media
 * reel).
 *
 * Two separate timelines, deliberately not one:
 *
 *   entrance   plays once, as the section arrives. Id/metadata settle
 *              first (quiet, always), then the statement unmasks line by
 *              line, then the media reveals. Gated on `allowMotion` only,
 *              so it still plays on mobile (Level 1 motion).
 *
 *   shift      a short (~80vh) scrubbed timeline once the section is
 *              established: the media gains a touch more presence (scale
 *              only — nothing reflows, nothing drifts sideways, which
 *              would read oddly against a now-centered composition).
 *              Gated on `allowParallax` (motion *and* desktop width) — the
 *              site's existing tier for continuous scroll-linked movement.
 *
 * CSS-first throughout: every masked/hidden state in project-feature.css is
 * scoped behind `.js-motion`, so without this hook (or under reduced motion,
 * which never adds that class) everything is simply visible, correctly
 * positioned, in document order.
 *
 * @param {object} refs
 * @param {import('react').RefObject<HTMLElement>} refs.sectionRef
 * @param {import('react').RefObject<HTMLElement>} refs.idRef Quiet id/title line.
 * @param {import('react').RefObject<HTMLElement>} refs.metaRef
 * @param {import('react').RefObject<HTMLElement>[]} refs.statementLineRefs
 * @param {import('react').RefObject<HTMLElement>} refs.mediaMaskRef
 * @param {import('react').RefObject<HTMLElement>} refs.mediaInnerRef
 * @param {object} [motion]
 * @param {number} [motion.shiftScale=1.06] Media scale at the end of the shift.
 */
export function useProjectFeatureChoreography(
  { sectionRef, idRef, metaRef, statementLineRefs, mediaMaskRef, mediaInnerRef },
  { shiftScale = 1.06 } = {}
) {
  const { allowMotion, allowParallax } = useMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const id = idRef.current;
    const meta = metaRef.current;
    const lines = statementLineRefs.map((ref) => ref.current).filter(Boolean);
    const mediaMask = mediaMaskRef.current;
    const mediaInner = mediaInnerRef.current;
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
      const ctx = gsap.context(() => {
        // --- Entrance — plays once, no scrub. ---
        const entrance = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
          defaults: { ease: GSAP_EASE.outExpo },
        });

        if (id) entrance.to(id, { opacity: 1, y: 0, duration: seconds('slow') }, 0);
        if (meta) entrance.to(meta, { opacity: 1, y: 0, duration: seconds('slow') }, 0.08);
        if (lines.length) {
          // Plain pixel `y`, not `yPercent` — see project-feature.css for
          // why: `yPercent` can't cleanly take over the CSS rest state's
          // transform, `y` (matching id/meta's own animation) can.
          entrance.to(lines, { y: 0, duration: seconds('reveal'), stagger: 0.12 }, 0.2);
        }
        if (mediaMask) {
          entrance.to(mediaMask, { clipPath: 'inset(0% 0 0 0)', duration: seconds('slower') }, 0.5);
        }
        if (mediaInner) {
          // clearProps once settled: this element also carries a CSS-only
          // hover micro-interaction, which an inline transform left behind
          // by GSAP would permanently outrank.
          entrance.to(mediaInner, {
            scale: 1,
            duration: seconds('slower'),
            onComplete: () => gsap.set(mediaInner, { clearProps: 'transform' }),
          }, 0.5);
        }

        // --- Compositional shift — short scrub, desktop + motion only. ---
        if (allowParallax && mediaInner) {
          const shift = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top+=15%',
              end: () => `+=${Math.round(window.innerHeight * 0.8)}`,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          });
          shift.to(mediaInner, { scale: shiftScale }, 0);
        }
      }, section);

      teardown = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [
    sectionRef,
    idRef,
    metaRef,
    statementLineRefs,
    mediaMaskRef,
    mediaInnerRef,
    allowMotion,
    allowParallax,
    shiftScale,
  ]);
}
