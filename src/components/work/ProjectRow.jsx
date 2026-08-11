import { useRef } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/cn.js';
import { useMotion } from '../../lib/motion-context.js';
import { useOpenOnView } from '../../hooks/useOpenOnView.js';
import { ProjectMedia } from './ProjectMedia.jsx';

/**
 * Composition weight.
 *
 * The three emphases are what give the index its rhythm — a lead project
 * dominates the frame, a quiet one recedes to a portrait column with the type
 * carrying the row. Alternating alignment does the rest, so no two consecutive
 * rows sit the same way on the page.
 */
const EMPHASIS = {
  lead: {
    media: 'lg:col-span-8',
    text: 'lg:col-span-4',
    mediaStart: ['lg:col-start-1', 'lg:col-start-5'],
    textStart: ['lg:col-start-9', 'lg:col-start-1'],
    title: 'text-display-3',
    aspect: '16 / 10',
    space: 'py-2xl lg:py-3xl',
  },
  standard: {
    media: 'lg:col-span-6',
    text: 'lg:col-span-4',
    mediaStart: ['lg:col-start-1', 'lg:col-start-7'],
    textStart: ['lg:col-start-8', 'lg:col-start-2'],
    title: 'text-heading-1',
    aspect: '4 / 3',
    space: 'py-2xl',
  },
  quiet: {
    media: 'lg:col-span-4',
    text: 'lg:col-span-5',
    mediaStart: ['lg:col-start-1', 'lg:col-start-9'],
    textStart: ['lg:col-start-6', 'lg:col-start-2'],
    title: 'text-heading-1',
    aspect: '3 / 4',
    space: 'py-2xl',
  },
};

/**
 * One project in the index.
 *
 * Interaction, by input rather than by screen size:
 *
 *   pointer   the frame opens on hover, the image settles from a slight
 *             overscale, the title steps aside, and the rest of the index
 *             dims around it.
 *   touch     the same opening, triggered as the row enters the viewport.
 *             Not a removed interaction and not a tap target to hunt for —
 *             the gesture simply has a different cause.
 *
 * The open state is a CSS custom property, so the pointer path costs no
 * JavaScript at all.
 */
const STATUS = { completed: 'Completed', 'in-progress': 'In progress' };

/**
 * Only a placeholder is badged in the index.
 *
 * Prior work is disclosed on the project page instead — see ProjectHeader.
 * The distinction still matters and is still stated plainly, but it is a fact
 * about the work, not a rank in the visual hierarchy, and a badge on every
 * second row would make it one.
 */
const ATTRIBUTION_NOTE = {
  placeholder: 'Placeholder',
};

export function ProjectRow({
  project,
  copy,
  index,
  priority = false,
  hasStory = false,
  titleAs: Title = 'h3',
}) {
  const { allowHover } = useMotion();
  const ref = useRef(null);

  const emphasis = EMPHASIS[project.emphasis] ?? EMPHASIS.standard;
  // Alternating sides. Column starts are declared per emphasis rather than
  // derived, because a span and a start have to agree — a 5-column text block
  // starting at column 9 runs off a 12-column grid.
  const side = index % 2 === 0 ? 0 : 1;
  const note = ATTRIBUTION_NOTE[project.attribution];

  // Touch: the frame opens as the row arrives rather than on hover.
  useOpenOnView(ref, !allowHover);

  const meta = [copy.category, project.year, STATUS[project.status]]
    .filter(Boolean)
    .join(' · ');

  const Wrapper = hasStory ? Link : 'div';
  const wrapperProps = hasStory
    ? { to: `/work/${project.slug}`, 'aria-label': `${copy.title} — view project` }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      ref={ref}
      className={cn(
        'project isolate-item grid grid-cols-4 items-end gap-gutter md:grid-cols-8 lg:grid-cols-12',
        emphasis.space
      )}
    >
      <div
        className={cn(
          'col-span-4 md:col-span-8 lg:row-start-1',
          emphasis.media,
          emphasis.mediaStart[side]
        )}
      >
        <ProjectMedia
          image={project.media.cover}
          tone={index}
          aspect={emphasis.aspect}
          priority={priority}
        />
      </div>

      <div
        className={cn(
          'col-span-4 md:col-span-8 lg:row-start-1',
          emphasis.text,
          emphasis.textStart[side]
        )}
      >
        <div className="flex items-baseline gap-sm">
          <span className="font-mono text-micro tabular-nums text-fg-subtle">
            {String(index + 1).padStart(2, '0')}
          </span>
          {note && (
            <span className="border border-line-strong px-2xs py-3xs font-mono text-micro uppercase tracking-label text-fg-subtle">
              {note}
            </span>
          )}
        </div>

        <Title className={cn('project__title mt-sm font-display', emphasis.title)}>
          {copy.title}
        </Title>

        {meta && (
          <p className="mt-2xs font-mono text-micro uppercase tracking-label text-fg-muted">
            {meta}
          </p>
        )}

        <p className="mt-md max-w-text text-body-sm text-fg-muted">{copy.description}</p>

        {hasStory && (
          <span className="link-underline mt-md inline-block font-mono text-micro uppercase tracking-label">
            View project
          </span>
        )}
      </div>
    </Wrapper>
  );
}
