import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';
import { useHeroTransition } from '../../hooks/useHeroTransition.js';
import { useHeroIntro } from '../../hooks/useHeroIntro.js';
import { useWordmarkPresence } from '../../hooks/useWordmarkPresence.js';
import { Reveal } from '../motion/Reveal.jsx';
import { HeroHeadline } from './HeroHeadline.jsx';

/**
 * The RELAT hero.
 *
 * Typography-led: no photograph, no atmospheric field, no texture. Typography,
 * negative space and the site's own cream ground carry the composition.
 *
 * Sequence: RELAT STUDIO reveals letter by letter, centred and uniform,
 * holds, then splits — the upper half exits upward and the lower half
 * downward, both leaving the viewport. Only then does the Hero content
 * arrive (nav + headline, then links), and last the persistent RELAT + small
 * STUDIO rises from below and stays through Work, then leaves downward,
 * for good, just before the Brand Statement. See useHeroIntro for that
 * choreography, WordmarkSignature below for the two nodes involved, and
 * useWordmarkPresence for its Hero → Work pose and that exit.
 *
 * Two zones, not one centred block: the message/action sits upper-left; the
 * identity sits at the bottom. See src/styles/hero.css.
 *
 * Scroll-exit behaviour (unrelated to the opening) lives in useHeroTransition.
 */
// Relative to the moment the opening releases the Hero (see useHeroIntro):
// the headline lands first, the links a beat behind it.
const LINKS_DELAY_MS = 200;

export function Hero({ className }) {
  const { hero, site } = getContent();

  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const deepenRef = useRef(null);
  const wordmarkRef = useRef(null);
  const introWordmarkRef = useRef(null);
  const introSplitRef = useRef(null);
  const [introSettled, setIntroSettled] = useState(false);

  useHeroTransition({ sectionRef, textRef, deepenRef });
  useHeroIntro({
    wordmarkRef,
    introWordmarkRef,
    introSplitRef,
    onSettle: () => setIntroSettled(true),
  });
  // Gated on `introSettled` — see useWordmarkPresence for why it must never
  // run concurrently with the intro's own tween of this same element.
  useWordmarkPresence({ wordmarkRef, active: introSettled });

  return (
    <>
      <section
        ref={sectionRef}
        data-section-theme="light"
        data-wordmark-state="hero"
        className={cn('relative flex min-h-svh flex-col overflow-hidden', className)}
      >
        {/* The Hero's ground lives on its own layer *below* the persistent
          * wordmark (signature.css sits at z -1), not on the section itself:
          * a `position: relative` section with an opaque background paints
          * above any negative-z sibling, which is what used to hide the
          * signature for the whole Hero. Stack while settled: this ground →
          * wordmark → headline/links (z-10) → nav. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[2] bg-bg" />

        {/* Carries the hero into the dark section beneath it on exit — see
          * useHeroTransition. The only visual layer besides type and ground. */}
        <div
          ref={deepenRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              'linear-gradient(175deg, rgb(26 23 21 / 0.55) 0%, rgb(16 14 12 / 0.92) 72%)',
          }}
        />

        <div
          ref={textRef}
          data-intro-hold="true"
          className={cn(
            'hero-text',
            'relative z-10 flex flex-1 flex-col px-gutter',
            // The persistent signature now sits one layer behind all page
            // content (signature.css's negative z-index) and at a
            // considerably smaller scale, so geometric overlap here is
            // expected and fine — legibility, not spacing, keeps the
            // headline/links reading cleanly on top of it.
            'pt-[calc(var(--nav-height)+var(--space-xl))] pb-2xl'
          )}
        >
          {/* `as="p"` rather than the default wrapping div — this needs to
            * stay the exact flex child hero.css's `align-self` targets. */}
          <Reveal
            as="p"
            className="hero-eyebrow font-mono text-label uppercase text-fg-muted"
          >
            {hero.eyebrow}
          </Reveal>

          <HeroHeadline
            lines={hero.headline}
            label={hero.headlineLabel}
            className="mt-lg lg:mt-xl"
          />

          {/* Follows the headline as a plain Reveal, not a second
            * choreographed beat, so it reads as a continuation rather than a
            * new gesture. */}
          <Reveal
            delay={LINKS_DELAY_MS}
            className="hero-actions mt-xl flex flex-wrap items-baseline gap-lg"
          >
            <Link
              to={hero.actions.primary.to}
              className="link-underline font-mono text-label uppercase text-fg"
            >
              {hero.actions.primary.label} →
            </Link>
            <Link
              to={hero.actions.secondary.to}
              className="link-underline font-mono text-label uppercase text-fg-muted"
            >
              {hero.actions.secondary.label}
            </Link>
          </Reveal>

          <Reveal
            as="p"
            delay={LINKS_DELAY_MS}
            aria-hidden="true"
            className="hero-cue hidden font-mono text-micro uppercase text-fg-subtle lg:block"
          >
            {hero.scrollCue}
          </Reveal>
        </div>
      </section>

      <WordmarkSignature
        wordmarkRef={wordmarkRef}
        introWordmarkRef={introWordmarkRef}
        introSplitRef={introSplitRef}
        text={site.wordmark}
      />
    </>
  );
}

/**
 * The persistent signature — one `position: fixed` node, present for the
 * rest of the homepage's scroll (src/styles/signature.css), never
 * unmounted, never duplicated.
 *
 * Two nested elements, not one, and the split matters: `signature-anchor`
 * owns position (fixed, bottom-centred, and the deliberate viewport-edge
 * clip) via one static CSS transform this component never touches again.
 * `wordmarkRef` — the wordmark itself — carries no CSS transform at all;
 * useHeroIntro and useWordmarkPresence are the only things that ever write
 * one, starting from a clean slate each time. Composing the two on a single
 * element is exactly the bug this codebase has hit before: GSAP's first
 * touch of `transform` can't decompose one a stylesheet already set, and
 * silently layers its own on top rather than replacing it.
 *
 * RELAT and STUDIO are split into their own elements rather than one run of
 * text — RELAT is the identity, STUDIO a small editorial annotation riding
 * its corner (signature.css) — but both live inside `wordmarkRef`, so they
 * move, scale and clip together as one piece.
 *
 * `aria-hidden` throughout: this is a typographic brand moment, not a
 * second landmark or a second link — the nav already has an accessible
 * "RELAT — home" link, and a screen reader hearing "RELAT STUDIO" a second
 * time here would be noise, not information.
 *
 * The intro is a separate, disposable layer. `introWordmarkRef` is the
 * complete "RELAT STUDIO" with every letter already in the DOM inside its
 * own mask (revealed by useHeroIntro, never typed). When the split starts,
 * the hook measures that element's real rendered box and builds two
 * identical clones inside `introSplitRef` (React never renders children
 * there) — top and bottom halves masked relative to that box, not the
 * viewport. The real wordmark stays invisible until it rises in after the
 * Hero content.
 *
 * @param {object} props
 * @param {import('react').RefObject<HTMLElement>} props.wordmarkRef
 * @param {import('react').RefObject<HTMLElement>} props.introWordmarkRef
 * @param {import('react').RefObject<HTMLElement>} props.introSplitRef
 * @param {string} props.text Space-separated "RELAT STUDIO".
 */
function WordmarkSignature({ wordmarkRef, introWordmarkRef, introSplitRef, text }) {
  const [primary, secondary] = text.split(' ');

  return (
    <>
      <div className="hero-intro-overlay" aria-hidden="true">
        <div ref={introWordmarkRef} className="hero-intro-wordmark">
          <span className="hero-intro-wordmark__relat">
            {[...primary].map((ch, i) => (
              <IntroLetter key={`r${i}`} ch={ch} />
            ))}
          </span>
          <span className="hero-intro-wordmark__studio">
            <IntroLetter ch=" " />
            {[...(secondary ?? '')].map((ch, i) => (
              <IntroLetter key={`s${i}`} ch={ch} />
            ))}
          </span>
        </div>
      </div>

      <div ref={introSplitRef} aria-hidden="true" />

      <div className="signature-anchor" aria-hidden="true">
        <div ref={wordmarkRef} data-intro-pending="true" className="signature-wordmark">
          <span className="signature-wordmark__relat font-display">{primary}</span>
          {secondary && (
            <span className="signature-wordmark__studio font-mono">{secondary}</span>
          )}
        </div>
      </div>
    </>
  );
}

function IntroLetter({ ch }) {
  return (
    <span className="hero-intro-letter-mask">
      <span className="hero-intro-letter">{ch === ' ' ? '\u00A0' : ch}</span>
    </span>
  );
}
