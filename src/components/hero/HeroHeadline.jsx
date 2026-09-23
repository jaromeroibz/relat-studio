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
 * @param {string} [props.size] Type step. The hero owns `text-hero`; other
 *   chapters borrow the gesture at their own scale.
 * @param {import('react').ElementType} [props.as='h1'] One `h1` per page.
 * @param {boolean} [props.noWrap=true] Locks each authored line to one row at
 *   `lg` so the writer's line breaks hold rather than the browser's. Only
 *   correct when the caller's column is guaranteed wide enough for its
 *   longest line — true for the hero and project titles. A caller
 *   with a narrower or more variable column (Contact's half-width sentence)
 *   must pass `false` and let the line wrap: `.hero-line`'s `overflow: hidden`
 *   exists to mask the vertical reveal, not to hide horizontal overflow, so a
 *   forced single line that doesn't fit gets silently cropped rather than
 *   wrapped.
 * @param {number} [props.delay=0] Milliseconds to hold before revealing, for
 *   a `trigger="mount"` headline that needs to follow something else first
 *   (the Hero's own opening wordmark) rather than firing the instant it
 *   mounts.
 */
export function HeroHeadline({
  lines,
  label,
  size = 'text-hero',
  as: Tag = 'h1',
  trigger = 'mount',
  noWrap = true,
  delay = 0,
  className,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!document.documentElement.classList.contains('js-motion')) return;

    // The hero is already on screen, so it reveals on mount. A headline further
    // down the page waits for the scroll to reach it — otherwise the moment is
    // spent before anyone sees it.
    if (trigger === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -20% 0px', threshold: 0.01 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }

    if (delay > 0) {
      const timer = setTimeout(() => element.classList.add('is-revealed'), delay);
      return () => clearTimeout(timer);
    }

    // One frame, so the initial transform is painted before it is released.
    const frame = requestAnimationFrame(() => {
      element.classList.add('is-revealed');
    });

    return () => cancelAnimationFrame(frame);
  }, [trigger, delay]);

  return (
    <Tag
      ref={ref}
      aria-label={label}
      className={cn('hero-headline', size, className)}
    >
      {lines.map((line, index) => (
        // Authored lines hold at desktop. Below that the measure is too narrow
        // to guarantee it, so they are allowed to wrap rather than overflow.
        <span
          key={line}
          className={cn('hero-line', noWrap && 'lg:whitespace-nowrap')}
          aria-hidden="true"
        >
          <span style={{ '--reveal-delay': `${index * 110}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
