import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { Reveal } from '../motion/Reveal.jsx';

/**
 * What the studio builds — four kinds of site, set as a ruled index rather
 * than four boxes: a hairline above each, a serif title, a plain description.
 * Any area with its own page links to it from the entry itself, with the
 * page's real name as the anchor text.
 *
 * @param {object} props
 * @param {string} props.heading
 * @param {{ title: string, body: string, link?: { label: string, to: string } }[]} props.items
 */
export function Builds({ heading, items }) {
  return (
    <Section theme="dark" space="sm" className="bg-bg text-fg">
      <Container width="wide">
        <Reveal>
          <h2 className="max-w-narrow text-display-3">{heading}</h2>
        </Reveal>

        <ul className="mt-2xl grid gap-x-gutter md:grid-cols-2">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(index % 2) * 90}
              className="border-t border-line pb-xl pt-md"
            >
              <h3 className="font-display text-heading-1">{item.title}</h3>
              <p className="mt-sm max-w-text text-body text-fg-muted">{item.body}</p>
              {item.link && (
                <p className="mt-md">
                  <TextLink to={item.link.to} className="font-mono text-label uppercase text-fg-muted">
                    {item.link.label} →
                  </TextLink>
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
