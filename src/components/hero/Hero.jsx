import { useRef } from 'react';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';
import { useHeroTransition } from '../../hooks/useHeroTransition.js';
import { HeroHeadline } from './HeroHeadline.jsx';
import { HeroMedia } from './HeroMedia.jsx';

/**
 * The RELAT hero.
 *
 * Three intentional compositions, not one scaled three ways:
 *
 *   mobile   type-led stack. Headline first and above the fold, media fills
 *            the remaining height beneath it.
 *   tablet   same stack, wider measure, taller media band.
 *   desktop  the media is a full-bleed layer clipped to the right of the
 *            frame, with type set over the open left. The negative space
 *            between them is the composition — and the clip is what the exit
 *            transition opens.
 *
 * Scroll behaviour lives in useHeroTransition. Media is a prop-swap away from
 * being real photography; see HeroMedia.
 *
 * @param {object} props
 * @param {string} [props.src] Hero image, once real photography exists.
 * @param {string} [props.alt]
 */
export function Hero({ src, alt, className }) {
  const { hero } = getContent();

  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const mediaRef = useRef(null);
  const innerRef = useRef(null);
  const lightRef = useRef(null);

  useHeroTransition({ sectionRef, textRef, mediaRef, innerRef, lightRef });

  return (
    <section
      ref={sectionRef}
      data-section-theme="light"
      className={cn(
        'relative flex min-h-svh flex-col overflow-hidden lg:block',
        className
      )}
    >
      <div
        ref={textRef}
        className={cn(
          'relative z-10 order-1 flex flex-col justify-end px-gutter',
          'pt-[calc(var(--nav-height)+var(--space-xl))] pb-xl',
          'lg:flex lg:min-h-svh lg:w-7/12 lg:justify-center lg:pb-2xl lg:pr-xl'
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

      {/* Inset below the navigation band at desktop, so the nav is never set
        * over the dark panel it cannot be read against. */}
      <HeroMedia
        src={src}
        alt={alt}
        frameRef={mediaRef}
        innerRef={innerRef}
        lightRef={lightRef}
        className={cn(
          'order-2 min-h-[42svh] w-full flex-1',
          'lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[var(--nav-height)] lg:min-h-0 lg:flex-none'
        )}
      />
    </section>
  );
}
