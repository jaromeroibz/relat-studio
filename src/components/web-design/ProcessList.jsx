import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Reveal } from '../motion/Reveal.jsx';

/**
 * The process as a table of contents: a numbered row per stage, ruled, with
 * the stage's name set large and its one line of detail beside it. No icons,
 * no connectors — the sequence is the numbering and the order down the page.
 *
 * @param {object} props
 * @param {string} props.heading
 * @param {{ index: string, title: string, body: string }[]} props.steps
 */
export function ProcessList({ heading, steps }) {
  return (
    <Section theme="dark" space="sm" className="bg-bg text-fg">
      <Container width="wide">
        <Reveal>
          <h2 className="max-w-narrow text-display-3">{heading}</h2>
        </Reveal>

        <ol className="mt-2xl border-b border-line">
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.index}
              delay={Math.min(index, 2) * 60}
              className="grid grid-cols-[3rem_1fr] items-baseline gap-x-md border-t border-line py-md lg:grid-cols-12 lg:gap-x-gutter lg:py-lg"
            >
              <span className="font-mono text-micro tabular-nums text-fg-subtle lg:col-span-1">
                {step.index}
              </span>
              <h3 className="font-display text-heading-1 lg:col-span-5">{step.title}</h3>
              <p className="col-start-2 mt-2xs max-w-text text-body text-fg-muted lg:col-span-5 lg:col-start-7 lg:mt-0">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
