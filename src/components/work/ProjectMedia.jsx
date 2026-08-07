import { cn } from '../../lib/cn.js';

/**
 * A project's image frame.
 *
 * The frame is clipped at rest and opens on interaction — the same gesture the
 * hero uses on exit. Reusing it is the point of this phase: the studio's
 * signature move is that images *open*, and it should read the same whether it
 * is driven by scroll or by a pointer.
 *
 * Real images lazy-load and carry explicit dimensions. A null image renders a
 * placeholder tone instead — never a stock photograph, never something that
 * could be mistaken for RELAT's work.
 *
 * @param {object} props
 * @param {import('../../data/projects.js').ProjectImage|null} props.image
 * @param {number} props.tone       Index into the placeholder tones.
 * @param {string} props.aspect     CSS aspect-ratio, e.g. '16 / 10'.
 * @param {boolean} props.priority  Skip lazy-loading for above-the-fold media.
 */
export function ProjectMedia({ image, tone = 0, aspect, priority = false, className }) {
  return (
    <div
      className={cn('project-media relative overflow-hidden', className)}
      style={{ aspectRatio: aspect }}
    >
      <div className="project-media__inner absolute inset-0 will-change-transform">
        {image?.src ? (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <PlaceholderTone tone={tone} />
        )}
      </div>
    </div>
  );
}

/**
 * Placeholder imagery.
 *
 * Warm light on a dark ground, varied per slot so a column of them still reads
 * as a composition rather than four identical blocks. Deliberately abstract —
 * it holds proportion and tone, and claims nothing.
 */
const TONES = [
  'radial-gradient(110% 85% at 70% 22%, rgb(228 99 44 / 0.32), transparent 64%)',
  'radial-gradient(95% 80% at 26% 30%, rgb(240 138 82 / 0.24), transparent 66%)',
  'radial-gradient(120% 95% at 52% 88%, rgb(247 177 137 / 0.20), transparent 70%)',
  'radial-gradient(100% 75% at 84% 62%, rgb(194 70 26 / 0.30), transparent 68%)',
];

function PlaceholderTone({ tone }) {
  return (
    <div
      className="relative h-full w-full"
      style={{ backgroundColor: 'var(--ink-800)' }}
      role="img"
      aria-label="Placeholder for project imagery"
    >
      <div className="absolute inset-0" style={{ background: TONES[tone % TONES.length] }} />
      <span
        className="absolute bottom-2xs left-2xs font-mono text-micro uppercase tracking-label"
        style={{ color: 'rgb(243 239 233 / 0.5)' }}
      >
        Placeholder
      </span>
    </div>
  );
}
