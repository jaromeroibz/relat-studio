import { useRef } from 'react';
import { cn } from '../../lib/cn.js';
import { useParallax } from '../../hooks/useParallax.js';

/**
 * The hero's visual panel.
 *
 * Pass `src`/`alt` and it renders a real image. Pass nothing and it renders a
 * placeholder — clearly labelled as one, because the site must never present
 * temporary material as RELAT's photography.
 *
 * Swapping in the final image is a prop change. Nothing about the composition,
 * the parallax or the surrounding layout depends on which branch renders.
 *
 * @param {object} props
 * @param {string} [props.src]
 * @param {string} [props.alt] Required whenever `src` is given.
 * @param {number} [props.width]
 * @param {number} [props.height]
 */
export function HeroMedia({ src, alt, width, height, className }) {
  const ref = useRef(null);

  // Slightly overscaled so the parallax travel never exposes an edge.
  useParallax(ref, { distance: 70, scale: 1.06 });

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div ref={ref} className="absolute inset-0 will-change-transform">
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
