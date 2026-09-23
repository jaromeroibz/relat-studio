import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { getLenis } from '../lib/scroll.js';

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
 * `lenis.scrollTo(target, { offset })` fires soon after, while the new
 * route's layout may still be settling — between the two, the page was
 * observed landing partway down the document, well short of the actual
 * target, not at its top and not at the anchor. `useHashScroll` already
 * handles "target doesn't exist yet on this route" with its own retry, so it
 * doesn't need a pre-zeroed Lenis to start from — it needs to be the only
 * thing driving the scroll.
 */
export function useRouteScrollReset() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    const pathnameChanged = pathname !== previousPathname.current;
    previousPathname.current = pathname;

    if (navigationType === 'POP') {
      const sync = () => getLenis()?.resize();
      queueMicrotask(sync);
      const raf = requestAnimationFrame(sync);
      const timer = setTimeout(sync, 60);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    if (!pathnameChanged) return;

    // A landing hash owns this navigation instead — see useHashScroll.
    if (hash) return;

    // Reduced motion never creates a Lenis instance (SmoothScroll.jsx) — the
    // plain reset is what's left to do the job there.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname, navigationType, hash]);
}
