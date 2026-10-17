import { useId, useState } from 'react';
import { cn } from '../../lib/cn.js';

/**
 * A typographic question list — ruled rows, a mono index, one answer open at
 * a time. The same accordion language as Capabilities (heading wraps the
 * button; `.capability-panel` collapse), as plain content rather than a card.
 *
 * Every answer is in the DOM and in the prerendered HTML; a closed one is
 * `inert`, so it is skipped by assistive technology and the tab order without
 * being removed. Reduced motion is handled globally (base.css).
 *
 * @param {object} props
 * @param {{ question: string, answer: string }[]} props.items
 */
export function FaqList({ items }) {
  const base = useId();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <ul className="border-b border-line">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${base}-answer-${index}`;

        return (
          <li key={item.question} className="border-t border-line">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="group flex w-full items-baseline gap-md py-md text-left lg:py-lg"
              >
                <span className="w-6 shrink-0 font-mono text-micro tabular-nums text-fg-subtle">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'flex-1 font-display text-heading-2 lg:text-heading-1',
                    'transition-transform duration-[--duration-base] ease-out-quint',
                    'lg:group-hover:translate-x-2 lg:group-focus-visible:translate-x-2'
                  )}
                >
                  {item.question}
                </span>
                <span aria-hidden="true" className="font-mono text-label text-fg-muted">
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              inert={!open}
              className={cn('capability-panel', open && 'capability-panel--open')}
            >
              {/* The panel's own bottom padding does not collapse with the row,
                * so it is moved onto the paragraph, which does. */}
              <div className="capability-panel__inner pb-0 pl-[calc(1.5rem+var(--space-md))]">
                <p className="max-w-text pb-md text-body text-fg-muted lg:pb-lg">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
