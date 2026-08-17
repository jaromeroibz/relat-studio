import { useRef } from 'react';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';
import { useHeroTransition } from '../../hooks/useHeroTransition.js';
import { HeroHeadline } from './HeroHeadline.jsx';
import { HeroLight } from './HeroLight.jsx';

/**
 * The RELAT hero.
 *
 * No photograph. The visual is a translucent refractive field (HeroLight)
 * occupying roughly the right half of the frame and dissolving before it
 * reaches the type.
 *
 * Typography stays the protagonist. The type occupies the left seven columns
 * at desktop and the lower half on narrow viewports, in both cases sitting in
 * clean paper — the field's presence comes from its scale, and scale only
 * works if there is somewhere for it not to be.
 *
 * Scroll behaviour lives in useHeroTransition.
 */
export function Hero({ className }) {
  const { hero } = getContent();

  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const bloomRef = useRef(null);
  const refractRef = useRef(null);
  const sheenRef = useRef(null);
  const deepenRef = useRef(null);

  useHeroTransition({ sectionRef, textRef, bloomRef, refractRef, sheenRef, deepenRef });

  return (
    <section
      ref={sectionRef}
      data-section-theme="light"
      className={cn('relative flex min-h-svh flex-col overflow-hidden', className)}
    >
      <HeroLight
        bloomRef={bloomRef}
        refractRef={refractRef}
        sheenRef={sheenRef}
        deepenRef={deepenRef}
      />

      <div
        ref={textRef}
        className={cn(
          'relative z-10 flex flex-1 flex-col justify-end px-gutter',
          'pt-[calc(var(--nav-height)+var(--space-xl))] pb-2xl',
          'lg:w-7/12 lg:justify-center lg:pb-3xl lg:pr-xl'
        )}
      >
        <p className="font-mono text-label uppercase text-fg-muted">{hero.eyebrow}</p>

        <HeroHeadline
          lines={hero.headline}
          label={hero.headlineLabel}
          className="mt-lg lg:mt-xl"
        />

        <p
          aria-hidden="true"
          className="mt-2xl hidden font-mono text-micro uppercase text-fg-subtle lg:block"
        >
          {hero.scrollCue}
        </p>
      </div>
    </section>
  );
}
