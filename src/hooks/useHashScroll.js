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
 *     target exists, so the lookup retries for a few beats instead of
 *     failing silently on the first one.
 *
 * The retry is timer-based, not requestAnimationFrame-based. rAF is throttled
 * or fully suspended in a backgrounded/hidden document — a link opened in a
 * new tab, or a tab that loses focus mid-navigation — and a suspended rAF
 * loop never finds the target and never retries. setTimeout keeps ticking
 * regardless, so the scroll still lands once the tab is actually looked at.
 *
 * Under reduced motion it jumps rather than animates. The offset clears the
 * fixed navigation so a heading never lands underneath it.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    let timer;
    let attempts = 0;
    const MAX_ATTEMPTS = 30;
    const RETRY_MS = 50;

    const findAndScroll = () => {
      const target = document.querySelector(hash);

      if (!target) {
        // The route may still be mounting. Give it a few beats, then stop.
        if (attempts++ < MAX_ATTEMPTS) timer = setTimeout(findAndScroll, RETRY_MS);
        return;
      }

      const offset = -getNavHeight() - 16;
      const lenis = getLenis();
      const animate = document.documentElement.classList.contains('js-motion');

      if (lenis && animate) {
        // `scrollTo` clamps its target to Lenis's own cached `limit` — the
        // document height as of its last measurement. Arriving from another
        // route, the target routinely exists (this retry's whole point)
        // before Lenis has re-measured the freshly mounted homepage's real
        // height, so `limit` is still whatever the *previous* route left it
        // at. Landing short of the anchor, silently, is that clamp — not a
        // missed target. `resize()` re-reads the real height synchronously,
        // so the clamp below is against today's document, not yesterday's.
        lenis.resize();
        lenis.scrollTo(target, { offset });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'auto' });
      }
    };

    // One tick deferred so the target has a chance to exist even on the very
    // first attempt, without waiting a full retry interval for the common case.
    timer = setTimeout(findAndScroll, 0);
    return () => clearTimeout(timer);
  }, [pathname, hash]);
}
