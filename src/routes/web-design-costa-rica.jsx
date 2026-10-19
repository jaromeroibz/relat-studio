import { Link } from 'react-router';
import { Container } from '../components/layout/Container.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Label } from '../components/ui/Label.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { HeroHeadline } from '../components/hero/HeroHeadline.jsx';
import { Disciplines } from '../components/web-design/Disciplines.jsx';
import { WorkProof } from '../components/web-design/WorkProof.jsx';
import { Builds } from '../components/web-design/Builds.jsx';
import { ProcessList } from '../components/web-design/ProcessList.jsx';
import { FaqSection } from '../components/sections/FaqSection.jsx';
import { getContent } from '../data/index.js';
import { buildMeta, serviceJsonLd } from '../lib/seo.js';
import { trackEvent } from '../lib/analytics.js';

const PATH = '/web-design-costa-rica';

export const meta = () => {
  const { webDesignCostaRica } = getContent();
  return buildMeta({
    title: webDesignCostaRica.meta.title,
    description: webDesignCostaRica.meta.description,
    path: PATH,
  });
};

/**
 * Web Design Costa Rica — RELAT's commercial page for its home market.
 *
 * One chapter of thinking on the cream ground (the brief, the approach, the
 * three disciplines), then a single transition to dark where the evidence and
 * the conversation live (work, what it builds, place, process, questions, the
 * invitation) and stay dark to the footer. Composed from the site's own
 * primitives, each section in its own arrangement — see src/components/
 * web-design — and without the homepage's opening: the page enters at once.
 *
 * Copy: src/data/en/web-design-costa-rica.js. No new analytics events:
 * `start_project_click` and `project_click` carry a `placement` for this page.
 */
export default function WebDesignCostaRica() {
  const { webDesignCostaRica: page, hero: home, startAProject } = getContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: page.service.name,
              serviceType: page.service.serviceType,
              description: page.service.description,
              path: PATH,
              anchor: true,
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
            <Label className="block text-balance">{home.eyebrow}</Label>
          </Reveal>

          <HeroHeadline
            lines={page.hero.headline}
            label={page.hero.headlineLabel}
            size="text-display-2"
            trigger="mount"
            noWrap={false}
            className="mt-lg max-w-[18ch] sm:max-w-none lg:text-[clamp(3.25rem,5.6vw,5.75rem)] lg:leading-[0.92] lg:tracking-[-0.035em]"
          />

          <Reveal delay={160} className="mt-lg max-w-text text-body-lg text-fg-muted">
            <p>{page.hero.body}</p>
          </Reveal>

          <Reveal delay={220} className="mt-xl flex flex-wrap items-baseline gap-lg">
            <Link
              to={page.hero.actions.primary.to}
              onClick={() => trackEvent('start_project_click', { placement: 'web_design_cr_hero' })}
              className="link-underline font-mono text-label uppercase text-fg"
            >
              {page.hero.actions.primary.label} →
            </Link>
            <Link
              to={page.hero.actions.secondary.to}
              className="link-underline font-mono text-label uppercase text-fg-muted"
            >
              {page.hero.actions.secondary.label}
            </Link>
          </Reveal>
        </Container>
      </Section>

      <Section theme="light" space="base" className="max-lg:pt-lg">
        <Container width="wide">
          <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              <Reveal>
                <Label>{page.approach.label}</Label>
              </Reveal>
              <Reveal delay={40}>
                <h2 className="mt-md max-w-narrow text-display-3">{page.approach.heading}</h2>
              </Reveal>
            </div>

            <Reveal
              delay={80}
              className="col-span-4 mt-lg flex flex-col gap-md md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-0"
            >
              {page.approach.body.map((paragraph) => (
                <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                  {paragraph}
                </p>
              ))}
              <p className="mt-md font-display text-heading-1">{page.approach.conclusion}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Disciplines heading={page.disciplines.heading} items={page.disciplines.items} />

      <WorkProof work={page.work} />

      <Builds heading={page.builds.heading} items={page.builds.items} />

      <Section theme="dark" space="sm" className="bg-bg text-fg">
        <Container width="wide">
          <Reveal>
            <h2 className="max-w-narrow text-display-2">{page.beyondLaunch.heading}</h2>
          </Reveal>
          <Reveal delay={60} className="mt-xl grid gap-md lg:grid-cols-2 lg:gap-gutter">
            {page.beyondLaunch.body.map((paragraph) => (
              <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section theme="dark" space="base" className="bg-bg text-fg">
        <Container width="wide">
          <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-9">
              <Reveal>
                <Label>{page.costaRica.label}</Label>
              </Reveal>
              <Reveal delay={40}>
                <h2 className="mt-md text-display-2">{page.costaRica.heading}</h2>
              </Reveal>
            </div>

            <Reveal
              delay={80}
              className="col-span-4 mt-lg flex flex-col gap-md md:col-span-6 lg:col-span-5 lg:col-start-5 lg:mt-xl"
            >
              {page.costaRica.body.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? 'max-w-text text-body-lg text-fg'
                      : 'max-w-text text-body-lg text-fg-muted'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <ProcessList heading={page.process.heading} steps={page.process.steps} />

      <FaqSection
        headingId="web-design-costa-rica-faq-heading"
        label={page.faq.label}
        heading={page.faq.heading}
        items={page.faq.items}
      />

      <Section theme="dark" space="lg" className="bg-bg text-fg">
        <Container width="wide">
          <Reveal className="flex flex-col items-center gap-sm text-center">
            <p className="font-mono text-label uppercase text-fg-subtle">{startAProject.heading}</p>
            <Link
              to={startAProject.action.to}
              onClick={() => trackEvent('start_project_click', { placement: 'web_design_cr_cta' })}
              className="poster-cta inline-block"
            >
              <span className="poster-cta__line font-display text-display-2 uppercase">
                {startAProject.action.label}
              </span>
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
