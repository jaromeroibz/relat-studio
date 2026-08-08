import { useEffect } from 'react';

/**
 * Adds `is-open` the first time an element reaches the viewport.
 *
 * This is the scroll-driven half of the studio's one gesture — images open.
 * The index uses it for touch, where there is no hover; project stories use it
 * everywhere, because a story is read by scrolling, not by pointing.
 *
 * The class only *permits* the open state. What that state looks like is CSS
 * (src/styles/work.css), so reduced motion and no-JS both resolve to an open
 * frame rather than a cropped one.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {boolean} [enabled=true]
 */
export function useOpenOnView(ref, enabled = true) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-open');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);
}
