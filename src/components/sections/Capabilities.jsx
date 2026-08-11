import { useState } from 'react';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';

/**
 * Capabilities.
 *
 * A typographic list, not a grid of cards. Focus is the whole interaction:
 * pointing at one capability recedes the others and swaps the supporting line
 * beside them — the isolation gesture the Work index already uses, applied to
 * type instead of images.
 *
 * Below `lg` there is no hover and no second column: each line carries its own
 * description underneath. Not a fallback — a different composition for a
 * narrower measure.
 *
 * The five together say Strategy × Design × Technology × Creativity without a
 * paragraph explaining it.
 */
export function Capabilities() {
  const { services } = getContent();
  const [active, setActive] = useState(0);

  return (
    <Section theme="light" space="lg" id="capabilities">
      <Container width="wide">
        <Reveal>
          <h2>
            <Label>Capabilities</Label>
          </h2>
        </Reveal>

        <div className="mt-2xl grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <ul className="isolate-group col-span-4 md:col-span-8 lg:col-span-7">
            {services.map((service, index) => (
              <li key={service.id} className="isolate-item border-t border-line">
                {/* A button, so the keyboard reaches the same state a pointer does. */}
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-describedby={`capability-${service.id}`}
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

                {/* The narrow composition: description in place, always visible.
                  * `sr-only` rather than `hidden` at desktop — display:none
                  * would drop it from the accessibility tree and break the
                  * aria-describedby above, leaving the list unexplained to a
                  * screen reader on exactly the viewport where the visible
                  * description lives in the other column. */}
                <p
                  id={`capability-${service.id}`}
                  className="max-w-text pb-md text-body-sm text-fg-muted lg:sr-only"
                >
                  {service.description}
                </p>
              </li>
            ))}
          </ul>

          {/* The wide composition: one description, changing. Hidden from
            * assistive technology — the same text is already associated with
            * each button above, and announcing it twice helps nobody. */}
          <div
            aria-hidden="true"
            className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:items-end"
          >
            <p
              key={services[active].id}
              className="max-w-text border-t border-line pt-md text-body-lg text-fg-muted"
              style={{
                animation: 'capability-in var(--duration-base) var(--ease-out-quint)',
              }}
            >
              {services[active].description}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
