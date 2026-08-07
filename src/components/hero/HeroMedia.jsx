import { cn } from '../../lib/cn.js';

/**
 * The hero's visual panel.
 *
 * Pass `src`/`alt` and it renders a real image. Pass nothing and it renders a
 * placeholder — clearly labelled as one, because the site must never present
 * temporary material as RELAT's photography.
 *
 * The frame is full-bleed at desktop and clipped to the right of the
 * composition by `--hero-clip`. Scrolling opens that clip (see
 * useHeroTransition), which reveals more of the same image rather than moving
 * or distorting it — the reason this is a clip and not a scale.
 *
 * Swapping in the final photograph is a prop change. Nothing about the
 * composition or the transition depends on which branch renders.
 *
 * @param {object} props
 * @param {string} [props.src]
 * @param {string} [props.alt] Required whenever `src` is given.
 * @param {import('react').RefObject<HTMLElement>} [props.frameRef]
 * @param {import('react').RefObject<HTMLElement>} [props.innerRef]
 * @param {import('react').RefObject<HTMLElement>} [props.lightRef]
 */
export function HeroMedia({
  src,
  alt,
  width,
  height,
  frameRef,
  innerRef,
  lightRef,
  className,
}) {
  return (
    <div ref={frameRef} className={cn('hero-media relative overflow-hidden', className)}>
      <div ref={innerRef} className="absolute inset-0 will-change-transform">
        {src ? (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <Placeholder />
        )}
      </div>

      {/* Warm light, lifted as the frame opens. Sits above the image so it
        * works with real photography exactly as it does with the placeholder —
        * this is the light motif, not a property of the placeholder. */}
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 will-change-transform"
        style={{
          background:
            'radial-gradient(90% 70% at 72% 26%, rgb(240 138 82 / 0.26), transparent 68%)',
        }}
      />
    </div>
  );
}

/**
 * Temporary. Holds the composition at the right proportions and carries the
 * light motif — warm luminosity on a dark ground — without pretending to be a
 * photograph. The caption is not decorative; it is the honesty.
 */
function Placeholder() {
  return (
    <div
      className="relative h-full w-full"
      style={{ backgroundColor: 'var(--ink-800)' }}
      role="img"
      aria-label="Placeholder for hero photography"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 68% 18%, rgb(228 99 44 / 0.30), transparent 62%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 20% 95%, rgb(247 177 137 / 0.14), transparent 70%)',
        }}
      />
      <span
        className="absolute bottom-md left-md font-mono text-micro uppercase tracking-label"
        style={{ color: 'rgb(243 239 233 / 0.55)' }}
      >
        Placeholder — brand photography pending
      </span>
    </div>
  );
}
