import { Container } from '../components/layout/Container.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Label } from '../components/ui/Label.jsx';
import { TextLink } from '../components/ui/TextLink.jsx';
import { Hero } from '../components/hero/Hero.jsx';
import { SelectedWork } from '../components/work/SelectedWork.jsx';
import { getContent } from '../data/index.js';

export const meta = () => {
  const { site } = getContent();
  return [
    { title: site.meta.title },
    { name: 'description', content: site.meta.description },
    { property: 'og:title', content: site.meta.title },
    { property: 'og:description', content: site.meta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: site.url },
  ];
};

/**
 * PHASE 3.
 *
 * Hero into Selected Work. The hero's exit lands on the dark ground the index
 * sits on, so the cream-to-dark transition delivers straight into the work.
 *
 * Capabilities, Approach, About and the contact CTA arrive in Phase 5.
 */
export default function Home() {
  const { site } = getContent();

  return (
    <>
      <Hero />
      <SelectedWork />

      <Section theme="light" space="base">
        <Container width="wide">
          <Label>Next</Label>
          <p className="mt-md max-w-text text-body-lg">
            Capabilities, approach and contact are still to come.{' '}
            <TextLink to="/work" className="text-accent">
              See all work
            </TextLink>
            .
          </p>
          <p className="mt-lg max-w-text text-body-sm text-fg-subtle">
            {site.name} — {site.location}
          </p>
        </Container>
      </Section>
    </>
  );
}
