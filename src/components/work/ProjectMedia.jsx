import { useRef } from 'react';
import { cn } from '../../lib/cn.js';
import { useOpenOnView } from '../../hooks/useOpenOnView.js';

/**
 * A project image frame.
 *
 * The frame is clipped at rest and opens on interaction — the studio's one
 * gesture. In the index the cause is a pointer; in a story it is the scroll.
 * The gesture is identical either way, which is what makes the portfolio feel
 * like one thing.
 *
 * Image treatment comes from the project's atmosphere via `--media-filter`,
 * so a monochrome project desaturates its photography without any component
 * knowing which project it is rendering.
 *
 * @param {object} props
 * @param {import('../../data/projects.js').ProjectImage|null} props.image
 * @param {number} [props.tone]      Index into the placeholder tones.
 * @param {string} props.aspect      CSS aspect-ratio, e.g. '16 / 10'.
 * @param {'cover'|'contain'} [props.fit]
 *   `contain` is for marks and artwork that must not be cropped. It also
 *   drops the overscale, because a logo that grows and settles reads as a
 *   mistake rather than as motion.
 * @param {boolean} [props.revealOnView] Open on scroll rather than on hover.
 * @param {boolean} [props.priority] Skip lazy-loading for above-the-fold media.
 * @param {string} [props.pendingLabel] What the placeholder is standing in for.
 */
export function ProjectMedia({
  image,
  tone = 0,
  aspect,
  fit = 'cover',
  revealOnView = false,
  priority = false,
  pendingLabel = 'Placeholder',
  className,
}) {
  const ref = useRef(null);
  useOpenOnView(ref, revealOnView);
  const isContained = fit === 'contain';

  return (
    <div
      ref={ref}
      className={cn(
        'project-media relative overflow-hidden',
        isContained && 'project-media--contain bg-bg-raised',
        className
      )}
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
            className={cn(
              'h-full w-full',
              isContained ? 'object-contain p-2xl' : 'object-cover'
            )}
          />
        ) : (
          <PlaceholderTone tone={tone} label={pendingLabel} />
        )}
      </div>
    </div>
  );
}

/**
 * Pending imagery.
 *
 * Warm light on a dark ground, varied per slot so a sequence of them still
 * reads as a composition. Abstract on purpose — it holds proportion and tone
 * and claims nothing. The label names what is missing.
 */
const TONES = [
  'radial-gradient(110% 85% at 70% 22%, rgb(228 99 44 / 0.32), transparent 64%)',
  'radial-gradient(95% 80% at 26% 30%, rgb(240 138 82 / 0.24), transparent 66%)',
  'radial-gradient(120% 95% at 52% 88%, rgb(247 177 137 / 0.20), transparent 70%)',
  'radial-gradient(100% 75% at 84% 62%, rgb(194 70 26 / 0.30), transparent 68%)',
];

function PlaceholderTone({ tone, label }) {
  return (
    <div
      className="relative h-full w-full"
      style={{ backgroundColor: 'var(--ink-800)' }}
      role="img"
      aria-label={`${label} — image not yet supplied`}
    >
      <div className="absolute inset-0" style={{ background: TONES[tone % TONES.length] }} />
      <span
        className="absolute bottom-2xs left-2xs font-mono text-micro uppercase tracking-label"
        style={{ color: 'rgb(243 239 233 / 0.5)' }}
      >
        {label}
      </span>
    </div>
  );
}
