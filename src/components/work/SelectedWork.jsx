import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { getContent, getFeaturedProjects } from '../../data/index.js';
import { ProjectFeature } from './ProjectFeature.jsx';

/**
 * Selected Work.
 *
 * Every featured project runs through ProjectFeature — one shared reveal,
 * choreography and metadata system (see ProjectFeature.jsx), with each
 * project's own editorial decisions (statement copy, reel images, media
 * aspect ratio) configured there. Adding a project is one array entry.
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
    <Section theme="dark" space={space} id="work" data-wordmark-state="work">
      <Container width="wide">
        {heading && (
          <header className="mb-2xl flex items-baseline justify-between gap-md">
            <h2>
              <Label className="text-fg">Selected Work</Label>
            </h2>
            <Label className="tabular-nums text-fg-subtle">
              {String(projects.length).padStart(2, '0')}
            </Label>
          </header>
        )}

        <div>
          {projects.map((project, index) => (
            <ProjectFeature
              key={project.slug}
              project={project}
              copy={projectCopy[project.slug]}
              index={index}
              titleAs={titleAs}
              leadIn={index === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
