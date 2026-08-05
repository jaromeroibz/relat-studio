import { Container } from '../components/layout/Container.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Label } from '../components/ui/Label.jsx';
import { TextLink } from '../components/ui/TextLink.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
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
 * PHASE 1 HOLDING PAGE.
 *
 * This is not the homepage. It exists to prove the foundation works in a real
 * scroll — theme transitions between bands, reveals on entry, the layout
 * primitives, the navigation over live content.
 *
 * The hero and the homepage sequence are Phase 2 and Phase 3. Nothing here
 * should be treated as a design decision.
 */
export default function Home() {
  const { site } = getContent();

  const bands = [
    {
      theme: 'light',
      label: 'Phase 1',
      heading: 'Foundation',
      body: 'Design tokens, layout primitives, navigation and the motion architecture. No sections have been designed yet.',
    },
    {
      theme: 'dark',
      label: 'Theme',
      heading: 'The document changes with the sequence.',
      body: 'Each band declares a theme. Whichever one owns the middle of the viewport drives the whole document, so the page reads as one continuous surface rather than a stack of blocks.',
    },
    {
      theme: 'warm',
      label: 'Motion',
      heading: 'Movement because there is space for it.',
      body: 'Reveals are visible by default and hide themselves only when motion is permitted. Nothing here depends on JavaScript to be readable.',
    },
  ];

  return (
    <>
      {bands.map((band, index) => (
        <Section
          key={band.theme}
          theme={band.theme}
          space="lg"
          className="flex min-h-svh items-center"
        >
          <Container width="wide">
            <Reveal>
              <Label>
                {String(index + 1).padStart(2, '0')} — {band.label}
              </Label>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-lg max-w-narrow text-display-2">{band.heading}</h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-lg max-w-text text-body-lg text-fg-muted">{band.body}</p>
            </Reveal>
          </Container>
        </Section>
      ))}

      <Section theme="light" space="base">
        <Container width="wide">
          <Label>Next</Label>
          <p className="mt-md max-w-text text-body-lg">
            The design system is ready for review.{' '}
            <TextLink to="/system" className="text-accent">
              Open the system page
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
