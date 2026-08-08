import { Container } from '../layout/Container.jsx';
import { Label } from '../ui/Label.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { HeroHeadline } from '../hero/HeroHeadline.jsx';

const STATUS = {
  completed: 'Completed',
  'in-progress': 'In progress',
};

const ATTRIBUTION_NOTE = {
  'prior-work': 'Completed before RELAT',
  placeholder: 'Placeholder',
};

/**
 * A project's title card.
 *
 * Deliberately the same opening move as the homepage hero — the line reveal,
 * the mono metadata, the same measure — so arriving at a project feels like
 * staying inside RELAT rather than entering a different site. The atmosphere
 * changes the air; the framing does not.
 *
 * Metadata is rendered only where it exists. A missing year is absent, never
 * guessed and never shown as an empty row.
 */
export function ProjectHeader({ project, copy }) {
  const meta = [
    ['Client', project.client],
    ['Year', project.year],
    ['Role', project.roles.length > 0 ? project.roles.join(', ') : null],
    ['Status', STATUS[project.status]],
  ].filter(([, value]) => Boolean(value));

  const note = ATTRIBUTION_NOTE[project.attribution];
  const wordmark = project.media.wordmark;

  return (
    <header
      data-section-theme="light"
      className="pt-[calc(var(--nav-height)+var(--space-3xl))] pb-2xl"
    >
      <Container width="wide">
        <div className="flex flex-wrap items-baseline gap-sm">
          <Label>{copy.category}</Label>
          {note && (
            <span className="border border-line-strong px-2xs py-3xs font-mono text-micro uppercase tracking-label text-fg-subtle">
              {note}
            </span>
          )}
        </div>

        <HeroHeadline
          lines={[copy.title]}
          label={copy.title}
          className="mt-lg max-w-narrow"
        />

        <div className="mt-3xl grid grid-cols-2 gap-lg border-t border-line pt-md md:grid-cols-4">
          {meta.map(([term, value]) => (
            <div key={term}>
              <dt className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                {term}
              </dt>
              <dd className="mt-3xs text-body-sm">{value}</dd>
            </div>
          ))}

          {project.url && (
            <div>
              <dt className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                Live
              </dt>
              <dd className="mt-3xs text-body-sm">
                <TextLink href={project.url}>Visit site</TextLink>
              </dd>
            </div>
          )}
        </div>

        {wordmark && (
          <div className="mt-2xl border-t border-line pt-lg">
            <img
              src={wordmark.src}
              alt={wordmark.alt}
              width={wordmark.width}
              height={wordmark.height}
              className="h-auto w-full max-w-[18rem]"
              style={{ filter: 'var(--media-filter, none)' }}
            />
          </div>
        )}
      </Container>
    </header>
  );
}
