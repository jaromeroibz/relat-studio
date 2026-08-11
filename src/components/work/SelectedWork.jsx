import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { getContent, getFeaturedProjects } from '../../data/index.js';
import { ProjectRow } from './ProjectRow.jsx';

/**
 * Selected Work.
 *
 * An editorial index rather than a grid: every row is composed differently,
 * alignment alternates, and emphasis varies so some projects dominate while
 * others recede. Adding a project is one array entry — the composition follows
 * from its `emphasis`, not from a column count.
 *
 * The section runs on the dark ground, which is where the hero's exit lands.
 * The images opening here are the same gesture the hero closes with.
 *
 * @param {object} props
 * @param {number} [props.limit]
 * @param {boolean} [props.heading] Render the section label. Off on /work,
 *   where the page already has an h1.
 * @param {'base'|'lg'} [props.space] Band rhythm. `lg` on the homepage, where
 *   the index follows the hero and needs room to land; `base` on /work, which
 *   already opens with a page header.
 */
export function SelectedWork({ limit, heading = true, space = 'lg' }) {
  const { projectCopy } = getContent();
  const projects = getFeaturedProjects(limit);

  if (projects.length === 0) return null;

  // Heading level follows the page: on the homepage this section owns an h2,
  // so projects are h3. On /work the page h1 sits directly above them, so they
  // are h2 and the hierarchy has no gap.
  const titleAs = heading ? 'h3' : 'h2';

  return (
    <Section theme="dark" space={space} id="work">
      <Container width="wide">
        {heading && (
          <header className="mb-2xl flex items-baseline justify-between gap-md border-b border-line pb-md">
            <h2>
              <Label className="text-fg">Selected Work</Label>
            </h2>
            <Label className="tabular-nums text-fg-subtle">
              {String(projects.length).padStart(2, '0')}
            </Label>
          </header>
        )}

        {/* isolate-group is what makes hovering one project recede the rest. */}
        <div className="isolate-group divide-y divide-line">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              copy={projectCopy[project.slug]}
              index={index}
              // Nothing in the index is above the fold — the homepage opens on
              // the hero and /work on a page header — so nothing here earns an
              // eager fetch competing with the first paint.
              priority={false}
              hasStory={Boolean(projectCopy[project.slug]?.story)}
              titleAs={titleAs}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
