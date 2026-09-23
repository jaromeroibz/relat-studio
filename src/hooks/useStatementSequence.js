import { useEffect } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { GSAP_EASE } from '../lib/motion.js';
import { LETTER_REVEAL_VARS, LETTER_DURATION_S, LETTER_STAGGER_S } from '../lib/letterReveal.js';

// Seconds on the sequence's own timeline. On desktop these are *proportions*
// of one scrubbed scroll (the wrapper's `--statement-scroll`); on smaller
// screens the same timeline plays in real time, sped up by TIME_SCALE.
const WORD_S = 0.9;
const WORD_STAGGER_S = 0.07;
const SETTLE_AT = 1.9; //   first phrase lifts: 1.9 → 2.7
const SETTLE_S = 0.8;
const LEAD_AT = 2.4; //     "It's the"
const RELAT_AT = 3.0; //    R E L A T, letter by letter
const RECOGNITION_S = 0.3; // a beat on the complete word
const IONSHIP_S = 0.6;
const TAIL_LAG_S = 0.35; // "between them." follows "ionship" closely
const HOLD_S = 1.8; //      the readable hold (~24% of the scroll)
const HANDOFF_S = 0.6; //   lift + ease out, into Capabilities
const WHITE_RISE_S = 1.5; // Capabilities' white plate rises over the handoff
const TIME_SCALE = 1.5;
const SCRUB_S = 1;

/**
 * The brand statement, as one restrained sequence:
 *
 *   first phrase reveals (masked words, alone, centred)
 *   → it lifts slightly and quietens
 *   → "It's the"
 *   → RELAT, one letter at a time (the Hero's own letter reveal)
 *   → a short recognition pause
 *   → "ionship" completes the word (the word re-centres as it grows)
 *   → "between them."
 *   → readable hold → the whole composition lifts and eases while
 *     Capabilities' white plate rises from below, so the white is already
 *     established when the section scrolls away and Capabilities enters.
 *
 * Desktop with motion: scrubbed over the sticky stage's scroll (see
 * statement.css). Anything smaller: no pin — the same timeline plays once,
 * in real time, when the section arrives, minus the hold and handoff.
 * Reduced motion / no JS: this never runs and the finished statement is
 * simply there.
 *
 * All hidden and offset states are written here rather than in CSS, so
 * nothing is ever hidden unless this actually runs.
 *
 * @param {object} refs
 * @param {import('react').RefObject<HTMLElement>} refs.wrapperRef Tall wrapper (scroll length).
 * @param {import('react').RefObject<HTMLElement>} refs.stageRef Centring stage.
 * @param {import('react').RefObject<HTMLElement>} refs.groupRef The whole composition.
 * @param {import('react').RefObject<HTMLElement>} refs.whitePlateRef Capabilities' white ground.
 */
export function useStatementSequence({ wrapperRef, stageRef, groupRef, whitePlateRef }) {
  const { allowMotion, isDesktop } = useMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const group = groupRef.current;
    const whitePlate = whitePlateRef.current;
    if (!wrapper || !stage || !group || !allowMotion) return;

    let cancelled = false;
    let teardown = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const part = (name) => group.querySelector(`[data-part="${name}"]`);
      const words = (name) => part(name).querySelectorAll('[data-part-word]');
      const first = part('first');
      const firstWords = words('first');
      const leadWords = words('lead');
      const tailWords = words('tail');
      const word = part('word');
      const letters = group.querySelectorAll('[data-part="letter"]');
      const suffix = part('suffix');

      const ctx = gsap.context(() => {
        // Hidden states — GSAP owns every transform here, from the first touch.
        gsap.set([...firstWords, ...leadWords, ...tailWords, suffix], { yPercent: 110, opacity: 0 });
        gsap.set(letters, { yPercent: 110, opacity: 0 });

        // Where the first phrase sits alone: the stage's centre. Measured with
        // layout offsets (unaffected by the transforms below), recomputed on
        // every refresh.
        const centreOffset = () =>
          stage.clientHeight / 2 - (first.offsetTop + first.offsetHeight / 2);
        // RELAT alone is centred; growing into RELATionship shifts the centre.
        const suffixHalf = () => suffix.parentElement.offsetWidth / 2;

        const tl = gsap.timeline({
          defaults: { ease: GSAP_EASE.outExpo },
          ...(isDesktop
            ? {
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top top',
                  end: 'bottom bottom',
                  // Numeric, not `true`: the timeline eases toward the scroll position
                  // over ~1s, so a fast flick catches up smoothly instead of
                  // snapping through every state (Lenis already smooths the input
                  // itself; this is the second, deliberate layer).
                  scrub: SCRUB_S,
                  invalidateOnRefresh: true,
                },
              }
            : {
                paused: true,
                scrollTrigger: {
                  trigger: wrapper,
                  start: 'top 30%',
                  once: true,
                  onEnter: () => tl.play(),
                },
              }),
        });

        // 1. The first phrase, alone at the centre.
        tl.fromTo(first, { y: centreOffset }, { y: centreOffset, duration: 0.001 }, 0);
        tl.to(firstWords, { yPercent: 0, opacity: 1, duration: WORD_S, stagger: WORD_STAGGER_S }, 0);

        // 2. It lifts slightly and becomes the context for the next thought.
        tl.to(
          first,
          { y: 0, scale: 0.92, opacity: 0.6, duration: SETTLE_S, ease: 'power2.inOut' },
          SETTLE_AT
        );

        // 3. "It's the"
        tl.to(leadWords, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, LEAD_AT);

        // 4. RELAT — the Hero's letter reveal, unchanged.
        tl.to(letters, LETTER_REVEAL_VARS, RELAT_AT);
        const relatDone = RELAT_AT + (letters.length - 1) * LETTER_STAGGER_S + LETTER_DURATION_S;

        // 5. Recognition pause, then "ionship" completes the word.
        const ionshipAt = relatDone + RECOGNITION_S;
        tl.fromTo(word, { x: suffixHalf }, { x: 0, duration: IONSHIP_S + 0.2, ease: 'power2.out' }, ionshipAt);
        tl.to(suffix, { yPercent: 0, opacity: 1, duration: IONSHIP_S }, ionshipAt);

        // 6. "between them."
        const tailAt = ionshipAt + TAIL_LAG_S;
        tl.to(tailWords, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, tailAt);
        const settled = tailAt + 0.5 + 0.06 * Math.max(0, tailWords.length - 1);

        if (isDesktop) {
          // 7. Hold, then hand off: the composition lifts and eases as
          // Capabilities begins to enter beneath it.
          const handoffAt = settled + HOLD_S;
          tl.to(
            group,
            {
              y: () => -0.045 * window.innerHeight,
              scale: 0.96,
              opacity: 0.85,
              duration: HANDOFF_S,
              ease: 'power1.inOut',
            },
            handoffAt
          );
          // A vertical takeover: a plain white plate, no fade or gradient.
          if (whitePlate) {
            tl.fromTo(
              whitePlate,
              { yPercent: 100 },
              { yPercent: 0, duration: WHITE_RISE_S, ease: 'power1.inOut' },
              handoffAt
            );
          }
          // Pin the timeline's length so the hold really is the final stretch.
          tl.to({}, { duration: 0.001 }, handoffAt + Math.max(HANDOFF_S, WHITE_RISE_S));
        } else {
          tl.timeScale(TIME_SCALE);
        }
      }, wrapper);

      teardown = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [wrapperRef, stageRef, groupRef, whitePlateRef, allowMotion, isDesktop]);
}
