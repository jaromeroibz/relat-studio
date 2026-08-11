import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { getLenis, getNavHeight } from '../lib/scroll.js';

/**
 * Sends `/#capabilities` to the right place, from anywhere.
 *
 * Two cases, and the second is the one that usually breaks:
 *
 *   already on the homepage — Lenis drives the scroll, so anchor navigation
 *     feels like the rest of the site rather than a hard jump.
 *   arriving from a project route — the homepage has to mount before the
 *     target exists, so the lookup retries for a few frames instead of
 *     failing silently on the first one.
 *
 * Under reduced motion it jumps rather than animates. The offset clears the
 * fixed navigation so a heading never lands underneath it.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    let frame;
    let attempts = 0;

    const findAndScroll = () => {
      const target = document.querySelector(hash);

      if (!target) {
        // The route may still be mounting. Give it a few frames, then stop.
        if (attempts++ < 20) frame = requestAnimationFrame(findAndScroll);
        return;
      }

      const offset = -getNavHeight() - 16;
      const lenis = getLenis();
      const animate = document.documentElement.classList.contains('js-motion');

      if (lenis && animate) {
        lenis.scrollTo(target, { offset });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'auto' });
      }
    };

    frame = requestAnimationFrame(findAndScroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}
