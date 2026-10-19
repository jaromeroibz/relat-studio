import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { FaqList } from '../ui/FaqList.jsx';
import { Reveal } from '../motion/Reveal.jsx';

/**
 * A page's FAQ: the label and heading on the left (sticky from `lg`), the
 * ruled accordion on the right — the same composition the hospitality page
 * uses, around the same `FaqList`.
 *
 * @param {object} props
 * @param {string} props.headingId Unique per page; labels the section.
 * @param {string} props.label
 * @param {string} props.heading
 * @param {{ question: string, answer: string }[]} props.items
 */
export function FaqSection({ headingId, label, heading, items }) {
  return (
    <Section
      theme="dark"
      space="base"
      aria-labelledby={headingId}
      className="bg-bg text-fg max-lg:pt-lg"
    >
      <Container width="wide">
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:sticky lg:top-[calc(var(--nav-height)+var(--space-xl))] lg:col-span-5 lg:self-start">
            <Reveal>
              <Label>{label}</Label>
            </Reveal>
            <Reveal delay={40}>
              <h2 id={headingId} className="mt-md max-w-narrow text-display-3">
                {heading}
              </h2>
            </Reveal>
          </div>
          <Reveal
            delay={80}
            className="col-span-4 mt-xl md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-0"
          >
            <FaqList items={items} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
