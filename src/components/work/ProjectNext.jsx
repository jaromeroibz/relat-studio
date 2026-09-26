import { Link } from 'react-router';
import { trackEvent } from '../../lib/analytics.js';
import { Container } from '../layout/Container.jsx';
import { Label } from '../ui/Label.jsx';
import { ProjectMedia } from './ProjectMedia.jsx';

/**
 * The closing transition.
 *
 * A project does not end — it hands over. The next project's frame opens as
 * you reach it, on the dark ground, using the same gesture the hero closes
 * with and the index opens with. That makes the portfolio a loop rather than
 * a set of pages with a back button.
 *
 * The whole panel is one link, so the target is the composition rather than a
 * small piece of text at the bottom of it.
 *
 * @param {object} props
 * @param {import('../../data/projects.js').Project} props.project Next project.
 * @param {import('../../data/en/projects.js').ProjectCopy} props.copy
 * @param {boolean} props.hasStory Whether that project has a page yet.
 */
export function ProjectNext({ project, copy, hasStory }) {
  const body = (
    <>
      <ProjectMedia
        image={project.media.cover ?? null}
        tone={2}
        aspect="21 / 9"
        revealOnView
        pendingLabel="Image pending"
      />
      <div className="mt-lg flex flex-wrap items-baseline justify-between gap-md">
        <h2 className="font-display text-display-3">{copy.title}</h2>
        <Label className="text-fg-subtle">{copy.category}</Label>
      </div>
    </>
  );

  return (
    <section
      data-section-theme="dark"
      // `--media-filter` (atmospheres.css) is a custom property and inherits
      // from the page-root `data-atmosphere` (work.$slug.jsx) — without this,
      // the handover would silently render in the CURRENT project's film
      // stock rather than the NEXT one's. Re-declaring it here for the next
      // project scopes the override to just this panel.
      data-atmosphere={project.atmosphere}
      className="border-t border-line py-section"
    >
      <Container width="wide">
        <Label className="text-fg-subtle">Next project</Label>

        <div className="mt-lg">
          {hasStory ? (
            <Link
              to={`/work/${project.slug}`}
              onClick={() =>
                trackEvent('project_click', {
                  project_slug: project.slug,
                  project_name: copy.title,
                  placement: 'next_project',
                })
              }
              className="project group block"
            >
              {body}
            </Link>
          ) : (
            // No page yet. The panel still closes the story, but it does not
            // pretend to lead somewhere.
            <div className="project">{body}</div>
          )}
        </div>
      </Container>
    </section>
  );
}
