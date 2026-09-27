import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import {
  cancelScrollMotion,
  captureScrollOrigin,
  getLenis,
  getSavedPosition,
  holdScrollPosition,
  recordPosition,
  releaseAnchorHold,
  setActiveLocation,
  syncAnchorOffset,
} from '../lib/scroll.js';
import { skipHeroIntro } from './useHeroIntro.js';

/**
 * Keeps Lenis in agreement with whatever the browser/router just did to
 * `window.scrollY` on a route change — in front of it, for a new route;
 * behind it, for Back/Forward.
 *
 * The bug this fixes: `<ScrollRestoration />` (root.jsx) sets the native
 * scroll position on navigation, but Lenis (SmoothScroll.jsx) never unmounts
 * between routes and keeps its own idea of it — `targetScroll`/
 * `animatedScroll`, carried over from whatever page you were just on. Nothing
 * tells Lenis that position is now meaningless, so its own ticker (driven by
 * `gsap.ticker`, running every frame regardless of route) re-applies it on
 * the very next frame and quietly overwrites whatever was just set — the new
 * page lands correctly, then is immediately dragged back to where you were
 * reading on the last one. Fully reloading the URL never shows this (there is
 * no Lenis instance yet to carry a stale position over), which is why it
 * reads as a routing bug rather than a scroll one.
 *
 * Two cases, opposite timing, same fix underneath — telling Lenis the real
 * number so its ticker has nothing left to correct:
 *
 *   PUSH/REPLACE (an actual link/`navigate()`) — the destination is always
 *     the top, and this hook knows that without waiting on anyone:
 *     `lenis.scrollTo(0, { immediate: true })`, in a `useLayoutEffect`
 *     (commits before paint, and this call itself sets native scroll — see
 *     its own `setScroll`), so there is nothing to see — no reset-then-jump,
 *     just the new page at the top. Reduced motion never creates a Lenis
 *     instance at all (`SmoothScroll.jsx`), so a plain `window.scrollTo(0, 0)`
 *     is the fallback for that case.
 *
 *   POP (browser Back/Forward) — `<ScrollRestoration />` already remembers
 *     where you were on that entry (or the hash you'd landed on) and is the
 *     one that should decide the number; this hook only has to make sure
 *     Lenis hears about it too, via `lenis.resize()` — deliberately *not*
 *     `lenis.scrollTo(value, { immediate: true })`, even though that reads
 *     as the obvious choice and was the first thing tried here. Lenis's own
 *     `scrollTo({ immediate: true })` calls `preventNextNativeScrollEvent()`
 *     internally, arming a one-shot flag so it can ignore the native
 *     `scroll` event that call's own `setScroll` is about to trigger. That
 *     flag doesn't check *which* scroll event it's ignoring, only that one
 *     is coming — so calling `scrollTo` here, shortly before
 *     `<ScrollRestoration />` fires its *own* native `window.scrollTo`, ends
 *     up arming the flag right in front of *that* event instead, and it is
 *     the one that gets silently swallowed: Lenis never learns the restored
 *     position and drags the page back to wherever this call happened to
 *     leave it, on its next tick. `resize()` re-reads `window.scrollY` into
 *     Lenis's own state directly and arms nothing, so calling it — even
 *     more than once, even before the restoration has actually happened —
 *     is always harmless; whichever call happens to run *after*
 *     `<ScrollRestoration />` (there is no reliable way to know in advance
 *     which one that is, so several are scheduled) is the one that matters,
 *     and it will read the correct, already-restored value.
 *
 * Deliberately narrow otherwise, so it never fights `useHashScroll`: a hash
 * change with no pathname change (`/#work` → `/#contact`) never enters either
 * branch above (`pathname` and `navigationType` are both unchanged, so the
 * effect does not even re-run) — that scroll is `useHashScroll`'s own
 * animated call on this same Lenis instance, and must stay smooth.
 *
 * A landing hash on a genuinely new route (`<Link to="/#capabilities">` from
 * a project page — the primary nav's actual shape, not a rare case) *does*
 * change the PUSH branch: this hook backs off entirely and leaves the
 * destination to `useHashScroll`, rather than forcing 0 first. That reset
 * was tried and measurably wrong — `lenis.scrollTo(0, { immediate: true })`
 * both snaps Lenis's own position AND arms `preventNextNativeScrollEvent()`
 * (see the POP case above for that flag), and `useHashScroll`'s own
 * `lenis.scrollTo(target)` fires soon after, while the new
 * route's layout may still be settling — between the two, the page was
 * observed landing partway down the document, well short of the actual
 * target, not at its top and not at the anchor. `useHashScroll` already
 * handles "target doesn't exist yet on this route" with its own retry, so it
 * doesn't need a pre-zeroed Lenis to start from — it needs to be the only
 * thing driving the scroll.
 *
 * Five more responsibilities, all of them "make the systems that can move
 * the page agree before `<ScrollRestoration />` acts" — this layout effect
 * runs ahead of that component's own:
 *
 *   - `syncAnchorOffset()` publishes the measured nav height as the anchors'
 *     `scroll-margin-top`, so the router's native `scrollIntoView` and
 *     Lenis's `scrollTo` land on the same pixel.
 *   - A navigation that carries a hash while the Hero's opening is still
 *     playing ends that opening first (`skipHeroIntro`). The intro's scroll
 *     lock exists to keep the *visitor* from scrolling past an unfinished
 *     opening; it must never be able to swallow a link they deliberately
 *     followed.
 *   - Any navigation first cancels a Lenis animation still in flight
 *     (`cancelScrollMotion`) — see there for why Lenis's own reset is not
 *     enough.
 *   - Back/Forward restores to the position the entry was left at, and holds
 *     it while the page finishes building (`holdScrollPosition`): a position
 *     deeper than the not-yet-complete document is otherwise clamped to it
 *     and never corrected.
 *   - A no-hash navigation that stays on the same route (the wordmark, while
 *     on `/`) means "top of this page": Lenis takes it, which also cancels
 *     any scroll it already had in flight — otherwise the router's native
 *     `scrollTo(0, 0)` loses to Lenis's next frame and the click does nothing.
 */
export function useRouteScrollReset() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);
  const previousKey = useRef(key);

  useLayoutEffect(() => {
    const pathnameChanged = pathname !== previousPathname.current;
    previousPathname.current = pathname;
    // `key` is minted per navigation, so this is false for the initial mount
    // and for StrictMode's replayed effects — neither is a visitor's intent.
    const navigated = key !== previousKey.current;
    previousKey.current = key;

    // Read before anything can scroll: the entry being returned to.
    const saved = getSavedPosition(key);
    setActiveLocation(key);

    if (navigated) {
      releaseAnchorHold();
      cancelScrollMotion();
    }
    syncAnchorOffset();
    if (navigated && hash) skipHeroIntro();

    if (navigationType === 'POP') {
      const release = saved === undefined ? null : holdScrollPosition(saved);

      const sync = () => getLenis()?.resize();
      queueMicrotask(sync);
      const raf = requestAnimationFrame(sync);
      const timer = setTimeout(sync, 60);
      return () => {
        release?.();
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    // A landing hash owns this navigation instead — see useHashScroll. The
    // router is about to scroll to it natively; note where the page is so
    // that jump can be undone before paint and Lenis can glide from here.
    if (hash) {
      if (navigated && getLenis()) captureScrollOrigin();
      return;
    }

    const lenis = getLenis();

    if (!pathnameChanged) {
      if (navigated && lenis) lenis.scrollTo(0);
      return;
    }

    // Lenis's reset keeps its own idea of the position in step. The native
    // write is the one that counts against the browser: Lenis skips the scroll
    // when it already believes it is at 0, and a native smooth scroll started
    // by the *previous* navigation's `scrollIntoView` (`<ScrollRestoration />`)
    // is cancelled only by an actual scroll write — left running, it carried
    // the new page a few pixels off the top. Reduced motion never creates a
    // Lenis instance (SmoothScroll.jsx), so there the native write is all of it.
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, navigationType, hash, key]);

  // The position each history entry was left at — what Back/Forward returns to.
  useEffect(() => {
    window.addEventListener('scroll', recordPosition, { passive: true });
    return () => window.removeEventListener('scroll', recordPosition);
  }, []);

}
