import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn.js';

/**
 * The hero headline, revealed line by line from behind its own baseline.
 *
 * Lines are authored in the content, not produced by wrapping — where a
 * display headline breaks is a composition decision.
 *
 * Accessibility: the split lines are hidden from assistive technology and the
 * whole sentence is exposed once via aria-label, so a screen reader hears one
 * heading rather than three fragments.
 *
 * The hero is above the fold, so this reveals on mount rather than on
 * intersection. Like every entrance on the site it is CSS-first — without
 * `js-motion` the text is simply visible.
 *
 * @param {object} props
 * @param {string[]} props.lines
 * @param {string} props.label Full sentence, for assistive technology.
 */
export function HeroHeadline({ lines, label, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!document.documentElement.classList.contains('js-motion')) return;

    // One frame, so the initial transform is painted before it is released.
    const frame = requestAnimationFrame(() => {
      element.classList.add('is-revealed');
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <h1
      ref={ref}
      aria-label={label}
      className={cn('hero-headline text-hero', className)}
    >
      {lines.map((line, index) => (
        // Authored lines hold at desktop. Below that the measure is too narrow
        // to guarantee it, so they are allowed to wrap rather than overflow.
        <span key={line} className="hero-line lg:whitespace-nowrap" aria-hidden="true">
          <span style={{ '--reveal-delay': `${index * 110}ms` }}>{line}</span>
        </span>
      ))}
    </h1>
  );
}
