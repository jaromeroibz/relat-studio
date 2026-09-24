import { useMemo, useRef, useState } from 'react';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { CapabilityMediaPanel } from './CapabilityPreview.jsx';
import { useCapabilityMedia } from '../../hooks/useCapabilityMedia.js';
import { useMotion } from '../../lib/motion-context.js';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';

/**
 * Capabilities.
 *
 * A typographic list on the left; a fixed media panel on the right,
 * always showing the active capability's imagery (defaulting to the
 * first) rather than sitting empty until something is hovered. The panel
 * never moves — only its image does, sliding directionally with list
 * position, same as Work's own vocabulary. See useCapabilityMedia.js for
 * the interaction and CapabilityPreview.jsx for the panel it drives.
 *
 * Below `lg` there is no fixed right column and no imagery at all — a
 * text-first accordion, tap/click only (no hover — `isDesktop` gates the
 * list's `onMouseEnter`, the same check useCapabilityMedia already uses to
 * stay fully inert below `lg`, so a resize across the breakpoint can never
 * leave a stray hover binding or a running tween/timer behind). Tapping a
 * row reveals its description and tags with a short opacity/`y` transition
 * (capability-preview.css) — the same `active` index desktop's own panel
 * reads, just with no image driving it here.
 *
 * The five together trace the shape of an engagement — strategy through
 * growth — without a paragraph explaining it.
 */
export function Capabilities() {
  const { services } = getContent();
  const { isDesktop } = useMotion();
  const [active, setActive] = useState(0);
  const wrapperRef = useRef(null);
  const ids = useMemo(() => services.map((service) => service.id), [services]);

  const { showPanel, layerRefs, layers } = useCapabilityMedia({ containerRef: wrapperRef, ids, active });

  return (
    <Section theme="light" space="lg">
      {/* The section's white ground — a plate of its own, not a theme: the
        * document stays warm cream underneath, so About (cream) simply resumes
        * where this ends. At z -2 it sits under the persistent signature. */}
      <div aria-hidden="true" className="capabilities-plate" />

      {/* `id="capabilities"` lives here, not on `Section` — see the matching
        * note in SelectedWork.jsx. `Container` sits past the section's own
        * top padding, which is where nav/anchor navigation should actually
        * land. */}
      <Container id="capabilities" width="wide">
        <Reveal>
          <h2>
            <Label>Capabilities</Label>
          </h2>
        </Reveal>

        <div ref={wrapperRef} className="relative mt-2xl grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <ul className="isolate-group col-span-4 md:col-span-8 lg:col-span-7">
            {services.map((service, index) => {
              const isActive = index === active;

              return (
                <li key={service.id} data-active={isActive} className="capability-row border-t border-line">
                  {/* A button, so the keyboard reaches the same state a
                    * pointer does. Hover only sets `active` at `lg`+, where
                    * the right-column panel makes that an obviously
                    * reversible preview — below it, changing capability is
                    * tap/click only. */}
                  <button
                    type="button"
                    onMouseEnter={isDesktop ? () => setActive(index) : undefined}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    aria-expanded={isActive}
                    aria-controls={`capability-panel-${service.id}`}
                    className="group flex w-full items-baseline gap-md py-md text-left lg:py-lg"
                  >
                    <span className="font-mono text-micro tabular-nums text-fg-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'font-display text-display-3 transition-transform duration-[--duration-base] ease-out-quint',
                        'lg:group-hover:translate-x-2 lg:group-focus-visible:translate-x-2'
                      )}
                    >
                      {service.title}
                    </span>
                  </button>

                  {/* Below `lg`: a text-only accordion panel — description,
                    * then tags, no image. Collapse/reveal is a pure-CSS
                    * `grid-template-rows` transition (capability-preview.css),
                    * not a JS height measurement, so it stays cheap for this
                    * short a block. At `lg`: always in the accessibility
                    * tree (`sr-only`, not `hidden` — the visible description
                    * lives in the right-column panel instead, and dropping
                    * this from the tree would leave the list unexplained to
                    * a screen reader on exactly the viewport where that
                    * panel exists) and always fully open, since `lg:block`
                    * overrides `display` and the collapse no longer applies. */}
                  <div
                    id={`capability-panel-${service.id}`}
                    className={cn('capability-panel', isActive && 'capability-panel--open', 'lg:block lg:sr-only')}
                  >
                    <div className="capability-panel__inner">
                      <p className="max-w-text text-body-sm text-fg-muted">{service.description}</p>
                      <p className="mt-3xs max-w-text font-mono text-micro uppercase text-fg-subtle">
                        {service.tags.join(' · ')}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* The right column: the fixed media panel, then the active
            * capability's description and tags directly beneath it — one
            * coherent response to whichever row is active, hidden from
            * assistive technology because the same text is already
            * associated with each button above. */}
          <div aria-hidden="true" className="hidden lg:col-span-5 lg:col-start-8 lg:block">
            {showPanel && <CapabilityMediaPanel layerRefs={layerRefs} layers={layers} />}
            <div
              key={services[active].id}
              className="mt-md border-t border-line pt-md"
              style={{
                animation: 'capability-in var(--duration-base) var(--ease-out-quint)',
              }}
            >
              <p className="max-w-text text-body-lg text-fg-muted">{services[active].description}</p>
              <p className="mt-xs max-w-text font-mono text-micro uppercase text-fg-subtle">
                {services[active].tags.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
