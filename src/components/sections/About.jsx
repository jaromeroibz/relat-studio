import { useRef } from 'react';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { ProjectMedia } from '../work/ProjectMedia.jsx';
import { useDarkTakeover } from '../../hooks/useDarkTakeover.js';
import { getContent } from '../../data/index.js';

/**
 * About.
 *
 * Humanises the studio without becoming a portfolio or a biography. Two short
 * paragraphs, three facts, one portrait — and nothing about years, awards or
 * passion.
 *
 * The portrait reuses the project media frame, so the studio's own picture
 * opens with exactly the gesture its clients' work does. Until real
 * photography exists it is a marked pending slot; nothing is borrowed.
 *
 * Asymmetric at desktop, with the image narrower than the text — the studio is
 * the subject here, not the person.
 *
 * Closes on one black curtain — a viewport-sized fixed overlay, not part of
 * this section's layout — see useDarkTakeover. About itself is static: its
 * cream is its own (`data-theme` + `bg-bg`), never animated, never revealed
 * behind the curtain.
 */
export function About() {
  const { about } = getContent();
  const sectionRef = useRef(null);
  const curtainRef = useRef(null);

  useDarkTakeover({ sectionRef, curtainRef });

  return (
    <Section
      ref={sectionRef}
      data-theme="light"
      space="lg"
      id="about"
      className="relative bg-bg text-fg"
    >
      {/* The document theme is announced by two sentinels rather than by the
        * section, so it turns dark exactly when the curtain has reached the
        * navigation — see about-curtain.css. */}
      <div aria-hidden="true" data-section-theme="light" className="about-sentinel" />

      {/* The one moving layer of this transition. Fixed, viewport-sized, above
        * everything in About; hidden until useDarkTakeover drives it. */}
      <div ref={curtainRef} aria-hidden="true" className="about-curtain" />

      <Container width="wide">
        <Reveal>
          <Label>{about.label}</Label>
        </Reveal>

        <div className="mt-2xl grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-5 lg:col-span-4 lg:row-start-1">
            <Reveal>
              <ProjectMedia
                image={about.media.portrait}
                tone={1}
                aspect="4 / 5"
                revealOnView
                pendingLabel={about.media.portraitPending}
              />
            </Reveal>
          </div>

          {/* One reveal for the whole column, not one per paragraph. Four
            * separate entrances inside a single section read as fidgeting. */}
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-center">
            <h2 className="max-w-narrow text-display-3">{about.heading}</h2>

            {about.body.map((paragraph) => (
              <p key={paragraph} className="mt-md max-w-text text-body-lg text-fg-muted">
                {paragraph}
              </p>
            ))}

            <dl className="mt-2xl grid gap-md border-t border-line pt-md sm:grid-cols-3">
              {about.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-3xs">
                  <dt className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                    {fact.label}
                  </dt>
                  <dd className="text-body-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {about.statement && (
              <p className="mt-2xl font-display text-heading-2 text-fg-muted">
                {about.statement.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
