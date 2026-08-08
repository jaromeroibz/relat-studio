import { Container } from '../layout/Container.jsx';
import { Label } from '../ui/Label.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { HeroHeadline } from '../hero/HeroHeadline.jsx';

const STATUS = {
  completed: 'Completed',
  'in-progress': 'In progress',
};

/**
 * Disclosure, at project level and in the studio's own voice.
 *
 * The wording is exact: the founder completed the work, and RELAT did not
 * exist yet. It never implies the studio was operating at the time, and it
 * never dresses that up as a credential.
 */
const ATTRIBUTION_NOTE = {
  'prior-work':
    "Selected work completed by RELAT's founder prior to the studio's launch.",
  placeholder: 'Placeholder — not a RELAT project.',
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

  // The wordmark is not repeated here — the story gives it its own plate.
  const note = ATTRIBUTION_NOTE[project.attribution];

  return (
    <header
      data-section-theme="light"
      className="pt-[calc(var(--nav-height)+var(--space-3xl))] pb-2xl"
    >
      <Container width="wide">
        <Label>{copy.category}</Label>

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

        {note && (
          <p className="mt-lg max-w-text text-body-sm text-fg-subtle">{note}</p>
        )}

      </Container>
    </header>
  );
}
