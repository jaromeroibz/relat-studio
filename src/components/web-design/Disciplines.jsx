import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Reveal } from '../motion/Reveal.jsx';

/**
 * Strategy, design and development as one connected sequence.
 *
 * Not three cards: the three disciplines hang from a single continuous rule,
 * each marked by a small square where it begins — one line, three stages —
 * so the order and the connection read at a glance. On a phone the same rule
 * repeats per stage, stacked in order.
 *
 * @param {object} props
 * @param {string} props.heading
 * @param {{ index: string, title: string, body: string }[]} props.items
 */
export function Disciplines({ heading, items }) {
  return (
    <Section theme="light" space="base" className="max-lg:pt-lg lg:pt-section-sm">
      <Container width="wide">
        <Reveal>
          <h2 className="max-w-narrow text-display-3">{heading}</h2>
        </Reveal>

        <ol className="mt-2xl grid grid-cols-1 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.index}
              delay={index * 90}
              className="relative mt-xl border-t border-line pt-lg before:absolute before:left-0 before:top-0 before:h-[7px] before:w-[7px] before:-translate-y-1/2 before:bg-fg before:content-[''] first:mt-0 lg:mt-0 lg:pr-gutter"
            >
              <span className="font-mono text-micro tabular-nums text-fg-subtle">{item.index}</span>
              <h3 className="mt-md font-display text-heading-1">{item.title}</h3>
              <p className="mt-sm max-w-text text-body text-fg-muted">{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
