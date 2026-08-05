import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn.js';

/**
 * The site's entrance primitive.
 *
 * Deliberately CSS-first. The element is styled hidden *only* when
 * `html.js-motion` is present — a class set by a pre-paint inline script that
 * checks `prefers-reduced-motion`. The consequences:
 *
 *   - No JavaScript        → content is visible. Nothing to go wrong.
 *   - Reduced motion       → content is visible. No transform, no delay.
 *   - Script fails to load → content is visible.
 *   - Otherwise            → hidden before first paint, so there is no flash,
 *                            then revealed on intersection.
 *
 * The observer disconnects after firing: entrances happen once.
 *
 * @param {object} props
 * @param {import('react').ElementType} [props.as='div']
 * @param {number} [props.delay=0] Milliseconds. Use sparingly — stagger reads
 *   as choreography up to about three steps, and as waiting after that.
 * @param {string} [props.className]
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // The pre-paint script only adds this when motion is permitted.
    if (!document.documentElement.classList.contains('js-motion')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      // Fires a little before the element reaches the fold, so the motion has
      // finished by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
