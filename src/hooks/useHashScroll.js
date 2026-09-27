import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { getLenis, getSavedPosition, holdAnchor } from '../lib/scroll.js';

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
 * It runs once per *navigation*, not once per distinct hash: the effect is
 * keyed on `location.key`, which the router mints for every navigation even
 * when the destination is identical. Keyed on `pathname`/`hash` alone, a
 * second click on the link you had already followed (`/#work` while sitting
 * on `/#work`) changed neither, the effect never re-ran, and the only thing
 * that moved the page was `<ScrollRestoration />`'s native jump — the heading
 * left flush under the nav, with Lenis never told.
 *
 * Back/Forward is not a navigation *intent*: the position the visitor had on
 * that history entry is restored (useRouteScrollReset), and this hook stays
 * out of its way. With no position on record for the entry it still lands the
 * hash. A cold page load also reports `POP`, but its key is `'default'` —
 * that one is this hook's to land.
 *
 * Where "the anchor" is comes from CSS (`scroll-margin-top`, base.css, kept
 * current by `syncAnchorOffset`), which Lenis and the browser both honour —
 * so this hook passes no offset of its own and cannot disagree with the
 * router's native jump.
 *
 * The landing is also *held*: the scroll is aimed at the layout as it is when
 * it is issued, which on an arrival (cold load, or a click during hydration)
 * can precede the layout above the target being complete. `holdAnchor` re-aims
 * as the page's height settles, instead of the scroll ending short for good.
 *
 * The retry is timer-based, not requestAnimationFrame-based. rAF is throttled
 * or fully suspended in a backgrounded/hidden document — a link opened in a
 * new tab, or a tab that loses focus mid-navigation — and a suspended rAF
 * loop never finds the target and never retries. setTimeout keeps ticking
 * regardless, so the scroll still lands once the tab is actually looked at.
 *
 * Under reduced motion it jumps rather than animates.
 */
export function useHashScroll() {
  const { key, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!hash) return;
    if (navigationType === 'POP' && key !== 'default' && getSavedPosition(key) !== undefined) return;

    let timer;
    let releaseHold;
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
        lenis.scrollTo(target);
      } else {
        // Instant, not smooth: with no Lenis yet, a native smooth scroll is
        // the one kind that a ScrollTrigger refresh can cancel mid-flight.
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }

      // The scroll above was aimed at the layout as it is *now*; keep it
      // aimed while the rest of the page finishes building.
      releaseHold = holdAnchor(target);
    };

    // One tick deferred so the target has a chance to exist even on the very
    // first attempt, without waiting a full retry interval for the common case.
    timer = setTimeout(findAndScroll, 0);
    return () => {
      clearTimeout(timer);
      releaseHold?.();
    };
  }, [key, hash, navigationType]);
}
