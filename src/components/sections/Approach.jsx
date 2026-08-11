import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { HeroHeadline } from '../hero/HeroHeadline.jsx';
import { getContent } from '../../data/index.js';

/**
 * Approach.
 *
 * A philosophy, not a workflow. There are no numbered steps and no arrows —
 * those describe a process, and RELAT's approach is a belief about where work
 * should start.
 *
 * This is the second of the homepage's large motion moments. It borrows the
 * hero's line reveal rather than inventing anything: the studio's founding
 * sentence arrives the same way the hero's did, one line rising at a time,
 * on the warm ground. Repeating that gesture once, at the right moment, is
 * what makes it read as the site's voice instead of an effect.
 *
 * The five words below are the method, set as a single statement and
 * annotated quietly beneath — deliberately a different shape from the
 * Capabilities list so the two chapters do not rhyme.
 */
export function Approach() {
  const { approach } = getContent();

  return (
    <Section theme="warm" space="lg" id="approach">
      <Container width="wide">
        <Reveal>
          <Label>Approach</Label>
        </Reveal>

        <HeroHeadline
          as="h2"
          trigger="view"
          size="text-display-2"
          lines={['Good digital work', 'starts with understanding.']}
          label="Good digital work starts with understanding."
          className="mt-lg max-w-narrow"
        />

        <Reveal delay={120}>
          <p className="mt-xl max-w-text text-body-lg text-fg-muted">
            The business, the audience, the context, the objective — first.
            Design and technology come after, and only in service of them.
          </p>
        </Reveal>

        {/* The method, as one line of type rather than five boxes. The line and
          * its annotations arrive together — the headline above is this
          * chapter's motion moment, and stacking a second staggered sequence
          * underneath it only competes with it. */}
        <Reveal delay={200}>
          <p className="mt-4xl font-display text-display-3">
            {approach.map((step, index) => (
              <span key={step.id}>
                {step.title}
                <span className="text-fg-subtle">
                  {index < approach.length - 1 ? '. ' : '.'}
                </span>
              </span>
            ))}
          </p>

          <ul className="mt-xl grid gap-lg border-t border-line pt-md sm:grid-cols-2 lg:grid-cols-5">
            {approach.map((step) => (
              <li key={step.id} className="flex flex-col gap-3xs">
                <span className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                  {step.title}
                </span>
                <span className="text-body-sm text-fg-muted">{step.description}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
