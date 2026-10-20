import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { ProjectFeature } from '../work/ProjectFeature.jsx';
import { getContent, getSelectedProjects } from '../../data/index.js';

/**
 * The studio's selected work, as proof inside a service page.
 *
 * Runs the same featured chapters as the homepage and /work, from the same
 * project data — nothing is restated here — so the work looks exactly as it
 * does everywhere else. What this module adds is the framing and the
 * attribution: Scotty Grand is RELAT's own work; Gecko Surf House and Bolaca
 * were completed by the founder before the studio launched, and the note below
 * says so in the site's already-approved words.
 *
 * @param {object} props
 * @param {{ label: string, heading: string, intro: string, attribution: string, all: { label: string, to: string } }} props.work
 */
export function WorkProof({ work }) {
  const { projectCopy } = getContent();
  const projects = getSelectedProjects();

  return (
    <Section theme="dark" space="lg" className="bg-bg text-fg">
      <Container width="wide">
        <Reveal>
          <Label className="block">{work.label}</Label>
        </Reveal>
        <Reveal delay={40}>
          <h2 className="mt-md max-w-narrow text-display-3">{work.heading}</h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-md max-w-text text-body-lg text-fg-muted">{work.intro}</p>
        </Reveal>

        <div className="mt-xl">
          {projects.map((project, index) => (
            <ProjectFeature
              key={project.slug}
              project={project}
              copy={projectCopy[project.slug]}
              index={index}
              titleAs="h3"
              leadIn={index === 0}
              placement="web_design_cr_work"
            />
          ))}
        </div>

        <p className="mt-lg max-w-text text-body-sm text-fg-subtle">{work.attribution}</p>
        <p className="mt-lg">
          <TextLink to={work.all.to} className="font-mono text-label uppercase text-fg-muted">
            {work.all.label} →
          </TextLink>
        </p>
      </Container>
    </Section>
  );
}
