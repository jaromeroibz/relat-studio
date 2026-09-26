import { useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { useCtaReveal, CTA_EASE } from '../../hooks/useCtaReveal.js';
import { trackEvent } from '../../lib/analytics.js';

/**
 * The homepage's mid-page pause, turned into the invitation itself rather
 * than a caption beside one.
 *
 * Centered, poster-scale, one link: no card, no fill, no pill, no arrow.
 * "Have something in mind?" is the quiet label; "Start a project" is the
 * whole mark, resting in RELAT's normal off-white foreground. The
 * expressive moment is colour, not motion — see poster-cta.css for the
 * hover/focus cycle. The entire mark is the link.
 *
 * Its content sits above About's curtain (`z-[70]` over the curtain's 60), so
 * it can be revealed while the curtain is still finishing — see useCtaReveal.
 *
 * The section carries its own dark ground (`data-theme` + `bg-bg`) and never
 * depends on the document being dark: About's black curtain hands off to
 * black that is already here. The document theme is announced by a sentinel
 * (about-curtain.css), not by the section.
 */
export function PosterCTA({ id, heading, action }) {
  const groupRef = useRef(null);

  // Beat 1 of the closing chapter: the mark rises through its mask, the
  // quiet label a moment behind it.
  const build = useCallback((gsap, group) => {
    const line = group.querySelector('[data-cta="line"]');
    const label = group.querySelector('[data-cta="label"]');
    gsap.set(line, { yPercent: 110 });
    gsap.set(label, { opacity: 0, y: 10 });
    return gsap
      .timeline()
      .to(line, { yPercent: 0, duration: 0.5, ease: CTA_EASE }, 0)
      .to(label, { opacity: 1, y: 0, duration: 0.4, ease: CTA_EASE }, 0.06);
  }, []);
  // Starts while the curtain is ~60% risen; over ~0.3 of a viewport of scroll.
  useCtaReveal({ groupRef, build, curtainAt: 0.6, length: 0.3 });

  return (
    <Section data-theme="dark" space="sm" id={id} className="bg-bg text-fg">
      <div aria-hidden="true" data-section-theme="dark" className="poster-sentinel" />
      <Container width="wide" className="relative z-[70]">
        <div ref={groupRef} className="flex flex-col items-center gap-sm text-center">
          <p data-cta="label" className="font-mono text-label uppercase text-fg-subtle">
            {heading}
          </p>

          <Link
            to={action.to}
            onClick={() => trackEvent('start_project_click', { placement: 'poster_cta' })}
            className="poster-cta inline-block"
          >
            <span className="cta-mask">
              <span data-cta="line" className="cta-mask-inner">
                <span className="poster-cta__line font-display uppercase">{action.label}</span>
              </span>
            </span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
