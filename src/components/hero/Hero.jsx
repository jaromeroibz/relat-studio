import { useRef } from 'react';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';
import { useHeroTransition } from '../../hooks/useHeroTransition.js';
import { HeroHeadline } from './HeroHeadline.jsx';

/**
 * The RELAT hero.
 *
 * Typography-led: no photograph, no atmospheric field, no texture. Typography,
 * negative space and the site's own cream ground carry the composition.
 *
 * Centred and asymmetric — each headline line is offset by a different
 * amount so the block reads as typeset rather than mechanically aligned, with
 * the offsets chosen to cancel so the mass still sits on the viewport's
 * centre line. See src/styles/hero.css.
 *
 * Scroll behaviour lives in useHeroTransition.
 */
export function Hero({ className }) {
  const { hero } = getContent();

  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const deepenRef = useRef(null);

  useHeroTransition({ sectionRef, textRef, deepenRef });

  return (
    <section
      ref={sectionRef}
      data-section-theme="light"
      className={cn('relative flex min-h-svh flex-col overflow-hidden bg-bg', className)}
    >
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
        className={cn(
          'hero-text',
          'relative z-10 flex flex-1 flex-col px-gutter',
          'pt-[calc(var(--nav-height)+var(--space-xl))] pb-2xl'
        )}
      >
        <p className="hero-eyebrow font-mono text-label uppercase text-fg-muted">
          {hero.eyebrow}
        </p>

        <HeroHeadline
          lines={hero.headline}
          label={hero.headlineLabel}
          className="mt-lg lg:mt-xl"
        />

        <p
          aria-hidden="true"
          className="hero-cue hidden font-mono text-micro uppercase text-fg-subtle lg:block"
        >
          {hero.scrollCue}
        </p>
      </div>
    </section>
  );
}
