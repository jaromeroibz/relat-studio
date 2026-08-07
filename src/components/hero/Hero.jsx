import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';
import { HeroHeadline } from './HeroHeadline.jsx';
import { HeroMedia } from './HeroMedia.jsx';

/**
 * The RELAT hero.
 *
 * Three intentional compositions, not one scaled three ways:
 *
 *   mobile   type-led stack. Headline first and above the fold, media fills
 *            the remaining height beneath it. No parallax.
 *   tablet   same stack, wider measure, taller media band.
 *   desktop  7/5 split. Type occupies the left with the media bleeding to the
 *            right edge — the negative space between them is the composition.
 *
 * Media is a prop-swap away from being real photography; see HeroMedia.
 *
 * @param {object} props
 * @param {string} [props.src] Hero image, once real photography exists.
 * @param {string} [props.alt]
 */
export function Hero({ src, alt, className }) {
  const { hero } = getContent();

  return (
    <section
      data-section-theme="light"
      className={cn(
        'relative flex min-h-svh flex-col overflow-hidden',
        'lg:grid lg:grid-cols-12 lg:items-stretch',
        className
      )}
    >
      <div
        className={cn(
          'relative z-10 flex flex-col justify-end px-gutter',
          'pt-[calc(var(--nav-height)+var(--space-xl))] pb-xl',
          'lg:col-span-7 lg:justify-center lg:pb-2xl lg:pr-xl'
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

      {/* Inset below the navigation band at desktop. The nav sits on paper at
        * every scroll position instead of over a dark panel it cannot be read
        * against, and the media still bleeds to the right and bottom edges. */}
      <HeroMedia
        src={src}
        alt={alt}
        className={cn(
          'min-h-[42svh] w-full flex-1',
          'lg:col-span-5 lg:mt-[var(--nav-height)] lg:min-h-0 lg:flex-none'
        )}
      />
    </section>
  );
}
