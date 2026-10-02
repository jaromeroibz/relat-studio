import { Link } from 'react-router';
import { Container } from '../components/layout/Container.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Label } from '../components/ui/Label.jsx';
import { TextLink } from '../components/ui/TextLink.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { HeroHeadline } from '../components/hero/HeroHeadline.jsx';
import { ProjectMedia } from '../components/work/ProjectMedia.jsx';
import { getContent, getProject } from '../data/index.js';
import { buildMeta, serviceJsonLd } from '../lib/seo.js';
import { trackEvent } from '../lib/analytics.js';

export const meta = () => {
  const { hospitality } = getContent();
  return buildMeta({
    title: hospitality.meta.title,
    description: hospitality.meta.description,
    path: '/hospitality-web-design',
  });
};

/**
 * Hospitality Web Design — RELAT's first dedicated vertical page.
 *
 * Not a generic service-page template: the same primitives the rest of the
 * site is built from (Section, Container, Reveal, HeroHeadline, ProjectMedia,
 * TextLink), arranged as one editorial sequence — discover, understand,
 * choose, book — rather than a stack of feature cards. See
 * src/data/en/hospitality.js for the copy and the content-honesty note on
 * Gecko Surf House.
 *
 * Deliberately does not reuse the homepage Hero's opening choreography
 * (useHeroIntro/WordmarkSignature) or a project page's ProjectHeader meta
 * grid — this page has its own, quieter opening: HeroHeadline's reveal-on-
 * mount, the same mechanism, a different arrangement.
 *
 * No new analytics taxonomy: `start_project_click` and `project_click` are
 * the same existing events the rest of the site fires, with a `placement`
 * value identifying this page. GA4 Enhanced Measurement already covers the
 * page_view for this route's own history change, so no extra view-tracking
 * hook was added — see the report for this task.
 */
export default function HospitalityWebDesign() {
  const { hospitality } = getContent();
  const project = getProject('gecko-surf-house');
  const media = project.media;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: hospitality.meta.title,
              description: hospitality.meta.description,
              path: '/hospitality-web-design',
            })
          ),
        }}
      />

      <Section
        as="header"
        theme="light"
        space="lg"
        className="pt-[calc(var(--nav-height)+var(--space-3xl))]"
      >
        <Container width="wide">
          <Reveal>
            <Label className="block">{hospitality.hero.eyebrow[0]}</Label>
            <Label className="mt-3xs block text-fg-subtle">{hospitality.hero.eyebrow[1]}</Label>
          </Reveal>

          <HeroHeadline
            lines={hospitality.hero.headline}
            label={hospitality.hero.headlineLabel}
            size="text-display-1"
            trigger="mount"
            noWrap={false}
            className="mt-lg max-w-narrow lg:max-w-[52rem] lg:text-[clamp(3.5rem,6vw,6rem)] lg:leading-[0.92] lg:tracking-[-0.035em]"
          />

          <Reveal delay={160} className="mt-lg max-w-text text-body-lg text-fg-muted">
            <p>{hospitality.hero.body}</p>
          </Reveal>

          <Reveal delay={220} className="mt-xl flex flex-wrap items-baseline gap-lg">
            <Link
              to="/#contact"
              onClick={() => trackEvent('start_project_click', { placement: 'hospitality_hero' })}
              className="link-underline font-mono text-label uppercase text-fg"
            >
              Start a project →
            </Link>
            <Link
              to="/work/gecko-surf-house/"
              onClick={() =>
                trackEvent('project_click', {
                  project_slug: 'gecko-surf-house',
                  project_name: 'Gecko Surf House',
                  placement: 'hospitality_hero',
                })
              }
              className="link-underline font-mono text-label uppercase text-fg-muted"
            >
              View Gecko Surf House →
            </Link>
          </Reveal>
        </Container>
      </Section>

      <Section theme="light" space="base">
        <Container width="narrow">
          <Reveal>
            <Label>{hospitality.guestJourney.label}</Label>
          </Reveal>
          <Reveal delay={40}>
            <h2 className="mt-md max-w-narrow text-display-3">{hospitality.guestJourney.heading}</h2>
          </Reveal>
          <Reveal delay={80} className="mt-lg flex flex-col gap-md">
            {hospitality.guestJourney.body.map((paragraph) => (
              <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section theme="light" space="base" className="max-lg:pt-lg">
        <Container width="wide">
          {/* The journey itself, as a quiet typographic sequence — not four
            * cards. Each word reveals a beat after the last, the same
            * stagger the Hero's own eyebrow/headline/links already use, so
            * nothing new is introduced to produce it. */}
          <div className="flex flex-wrap items-baseline gap-sm font-mono text-label uppercase tracking-label text-fg-subtle">
            {hospitality.journeySteps.map((step, index) => (
              <span key={step} className="flex items-baseline gap-sm">
                <Reveal as="span" delay={index * 90}>
                  {step}
                </Reveal>
                {index < hospitality.journeySteps.length - 1 && (
                  <span aria-hidden="true" className="text-fg-subtle">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>

          <div className="mt-xl grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <Reveal>
                <ProjectMedia
                  image={media[hospitality.discovery.media]}
                  tone={0}
                  aspect="16 / 9"
                  revealOnView
                />
              </Reveal>
            </div>
            <Reveal className="col-span-4 md:col-span-8 lg:col-span-5 lg:self-center">
              <h2 className="text-display-3">{hospitality.discovery.heading}</h2>
              <div className="mt-md flex flex-col gap-sm">
                {hospitality.discovery.body.map((paragraph) => (
                  <p key={paragraph} className="max-w-text text-body text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="mt-2xl grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
            <Reveal className="order-2 col-span-4 md:col-span-8 lg:order-1 lg:col-span-5 lg:self-center">
              <div className="flex flex-col gap-sm">
                {hospitality.booking.body.map((paragraph) => (
                  <p key={paragraph} className="max-w-text text-body text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
            <div className="order-1 col-span-4 md:col-span-8 lg:order-2 lg:col-span-7">
              <Reveal>
                <ProjectMedia
                  image={media[hospitality.booking.media]}
                  tone={1}
                  aspect="16 / 10"
                  revealOnView
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="dark" space="lg" className="bg-bg text-fg">
        <Container width="wide">
          <div className="flex flex-wrap items-baseline justify-between gap-md">
            <div>
              <Label>{hospitality.proof.label}</Label>
              <p className="mt-3xs font-mono text-micro uppercase tracking-label text-fg-subtle">
                {hospitality.proof.category}
              </p>
            </div>
            <p className="font-mono text-micro uppercase tracking-label text-fg-subtle">
              {hospitality.proof.capabilities.join(' · ')}
            </p>
          </div>

          <Reveal delay={40}>
            <h2 className="mt-lg max-w-narrow text-display-2">{hospitality.proof.heading}</h2>
          </Reveal>

          <div className="mt-xl grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-8">
              <Reveal>
                <ProjectMedia
                  image={media[hospitality.proof.media.anchor]}
                  tone={2}
                  aspect="16 / 10"
                  revealOnView
                />
              </Reveal>
            </div>
            <div className="col-span-4 md:col-span-4 lg:col-span-4">
              <Reveal delay={60}>
                <ProjectMedia
                  image={media[hospitality.proof.media.secondary]}
                  tone={3}
                  aspect="9 / 16"
                  revealOnView
                />
              </Reveal>
            </div>
          </div>

          <Reveal delay={100} className="mt-xl flex flex-col gap-md">
            {hospitality.proof.body.map((paragraph) => (
              <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>

          {/* No placeholder in production — this is the one spot a
            * testimonial can be inserted later without restructuring. */}
          {hospitality.proof.testimonial && (
            <blockquote className="mt-xl max-w-text border-l border-line pl-md text-body-lg text-fg">
              {hospitality.proof.testimonial}
            </blockquote>
          )}

          <p className="mt-lg max-w-text text-body-sm text-fg-subtle">{hospitality.proof.attribution}</p>

          <div className="mt-lg">
            <TextLink
              to="/work/gecko-surf-house/"
              onClick={() =>
                trackEvent('project_click', {
                  project_slug: 'gecko-surf-house',
                  project_name: 'Gecko Surf House',
                  placement: 'hospitality_proof',
                })
              }
              className="font-mono text-label uppercase text-fg-muted"
            >
              View Gecko Surf House →
            </TextLink>
          </div>
        </Container>
      </Section>

      <Section theme="light" space="base">
        <Container width="narrow">
          <Reveal>
            <h2 className="max-w-narrow text-display-3">{hospitality.builtAsOne.heading}</h2>
          </Reveal>
          <Reveal delay={40} className="mt-md flex flex-col gap-sm">
            {hospitality.builtAsOne.body.map((paragraph) => (
              <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal delay={80} className="mt-md">
            <TextLink to="/#capabilities" className="font-mono text-label uppercase text-fg-muted">
              Explore capabilities →
            </TextLink>
          </Reveal>
        </Container>
      </Section>

      <Section theme="dark" space="sm" className="bg-bg text-fg">
        <Container width="narrow">
          <Reveal>
            <h2 className="max-w-narrow text-heading-1">{hospitality.localContext.heading}</h2>
            <div className="mt-sm flex flex-col gap-2xs">
              {hospitality.localContext.body.map((paragraph) => (
                <p key={paragraph} className="max-w-text text-body text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section theme="dark" space="lg" className="bg-bg text-fg">
        <Container width="wide">
          <Reveal className="flex flex-col items-center gap-sm text-center">
            <p className="font-mono text-label uppercase text-fg-subtle">{hospitality.cta.heading}</p>
            <Link
              to={hospitality.cta.action.to}
              onClick={() =>
                trackEvent('start_project_click', { placement: 'hospitality_cta' })
              }
              className="poster-cta inline-block"
            >
              <span className="poster-cta__line font-display text-display-2 uppercase">
                {hospitality.cta.action.label}
              </span>
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
