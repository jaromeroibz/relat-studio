/**
 * A handle on the Lenis instance.
 *
 * SmoothScroll owns the lifecycle; anything that needs to *drive* the scroll —
 * anchor navigation, for now — reads it from here. A module variable rather
 * than context because there is exactly one scroller and it is not React
 * state: nothing re-renders when it changes.
 */

let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/**
 * Height of the fixed navigation, in pixels.
 *
 * Measures the real nav (`#site-nav`, Nav.jsx), not the `--nav-height`
 * token: that token is the *intended* reservation other layout (the Hero's
 * own top padding) budgets against, but the actual header is sized by its
 * content — a row of text plus `py-md` — and the two can disagree by a few
 * pixels at a given viewport width. Anchor navigation landing a heading
 * partly under the nav, or a few pixels further below it than intended,
 * is exactly that gap showing up. Measuring the element directly can never
 * drift from what's actually on screen. Falls back to the token-probe
 * technique only if the nav genuinely isn't in the DOM yet.
 */
export function getNavHeight() {
  if (typeof window === 'undefined') return 0;

  const nav = document.getElementById('site-nav');
  if (nav) return nav.getBoundingClientRect().height;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;height:var(--nav-height)';
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height;
}

/**
 * How far anchor navigation (`useHashScroll.js`) should land below the
 * fixed nav — the one number every `#work`/`#capabilities`/`#about`/
 * `#contact` link shares, rather than each guessing its own pixel value.
 *
 * `--space-md` (24px) past the nav's real measured height: enough that the
 * landed heading visibly clears the header rather than grazing it, without
 * reading as its own extra pause the way a full section gap would.
 */
export function getAnchorOffset() {
  if (typeof window === 'undefined') return 0;

  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:var(--space-md)';
  document.body.appendChild(probe);
  const breathingRoom = probe.getBoundingClientRect().height;
  probe.remove();

  return -(getNavHeight() + breathingRoom);
}

/**
 * Publishes the anchor offset as `--anchor-offset` (px) on `<html>`, which
 * `base.css` applies as `scroll-margin-top` to the four anchor targets.
 *
 * Every system that can move the page to `#work` etc. must agree on where
 * that is. Lenis reads the target's scroll-margin natively (it subtracts it
 * from the position it computes), and so does the browser's own
 * `scrollIntoView()` — which is exactly what `<ScrollRestoration />` calls on
 * every hash navigation. Publishing the one measured number here means both
 * land on the same pixel, instead of the router's native jump putting the
 * heading under the nav and Lenis then having to correct it.
 *
 * Called on every navigation (useRouteScrollReset), so it is always the
 * current nav height for the current viewport.
 */
export function syncAnchorOffset() {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty('--anchor-offset', `${-getAnchorOffset()}px`);
}

/**
 * Back/Forward position memory.
 *
 * React Router's own saved positions live in a module-private object that is
 * only written to sessionStorage on `pagehide`, so they cannot be read during
 * the session. This is the same idea kept where we can see it: the last scroll
 * position of each history entry, keyed by `location.key`.
 */
const savedPositions = new Map();
let activeKey;
let releaseHold = null;
let releaseAnchor = null;

/** Tells the recorder which history entry the visitor is on now. */
export function setActiveLocation(key) {
  activeKey = key;
}

/** `window.scrollY` last seen on a history entry, or `undefined` if never scrolled. */
export function getSavedPosition(key) {
  return savedPositions.get(key);
}

/**
 * Scroll listener body. Frozen while a restoration is being held, so the
 * intermediate positions of an unfinished restoration are never mistaken for
 * the position the visitor actually chose.
 */
export function recordPosition() {
  if (releaseHold || activeKey === undefined) return;
  savedPositions.set(activeKey, window.scrollY);
}

const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

// How long the document's height must stay unchanged before a restoration is
// considered finished. Layout completion has no event of its own (pin spacers
// appear when GSAP's effects run, images decode, fonts swap), so "the height
// stopped moving" is the signal; this is only how long "stopped" has to last.
const HOLD_QUIET_MS = 500;

/**
 * Restores `y` and keeps it restored while the page finishes building.
 *
 * Back/Forward commits the destination route and asks the browser to scroll
 * to the saved position in the same breath — but the document is not yet as
 * tall as it was when the position was saved (ScrollTrigger pin spacers and
 * anything else that mounts in effects are still to come), so the browser
 * clamps the scroll to the shorter page and nothing ever re-applies it: a
 * position of 9000 came back as 5568. This re-applies `y` whenever the body's
 * height changes, until the layout has been quiet for `HOLD_QUIET_MS`, the
 * visitor takes over (wheel, touch, key, pointer), or another navigation
 * starts (the returned function). Deterministic on layout, not on a fixed
 * delay.
 *
 * @param {number} y
 * @returns {() => void} Ends the hold.
 */
export function holdScrollPosition(y) {
  releaseHold?.();

  let quiet;
  const apply = () => {
    if (Math.abs(window.scrollY - y) <= 1) return;
    window.scrollTo({ top: y, behavior: 'instant' });
    getLenis()?.resize();
  };
  const release = () => {
    clearTimeout(quiet);
    observer.disconnect();
    for (const type of TAKEOVER_EVENTS) window.removeEventListener(type, release, true);
    if (releaseHold === release) releaseHold = null;
  };
  const observer = new ResizeObserver(() => {
    apply();
    clearTimeout(quiet);
    quiet = setTimeout(release, HOLD_QUIET_MS);
  });

  releaseHold = release;
  for (const type of TAKEOVER_EVENTS) window.addEventListener(type, release, { capture: true, passive: true });
  observer.observe(document.body);
  // Applied here too, synchronously, rather than waiting on the observer's
  // first (async) callback: whatever the browser's own restoration attempt
  // did or didn't do to `window.scrollY` on this same navigation — including
  // not touching it at all — this hold's job is to guarantee `y`, not merely
  // to correct drift away from it once something else has already tried.
  apply();
  return release;
}

/**
 * Keeps an anchor landing on its target while the page finishes building.
 *
 * `scrollTo(target)` measures the target once, at the moment it is called —
 * and arriving on a page (a cold load of `/#contact`, or a click made while
 * the page is still hydrating) that moment can precede the page being
 * finished, in two different ways. Measured on a cold `/work/scotty-grand` →
 * Contact click, roughly a third of runs ended hundreds of pixels short of the
 * target and stayed there:
 *
 *   - layout still growing above the target (ScrollTrigger pin spacers and
 *     the rest of what mounts in effects push it down after it was measured);
 *   - the scroll itself being cancelled. Before Lenis exists the only scroll
 *     is the browser's native smooth one, and ScrollTrigger's own refresh on
 *     window `load` sets the scroll position to 0 and back — which cancels a
 *     native smooth scroll wherever it happens to be, freezing it mid-page.
 *
 * So the landing is a hold, not a one-shot. The target is re-measured and aimed
 * at again when the body's height changes, and unconditionally once after
 * `load` (after every other `load` handler, ScrollTrigger's included, has
 * run) and when fonts finish loading. Lenis simply retargets an animation
 * already in flight; the native fallback is instant, so there is nothing for a
 * refresh to cancel. It ends once the page is loaded and the layout has been
 * quiet for `HOLD_QUIET_MS`, when the visitor takes over (wheel, touch, key,
 * pointer), or when another navigation starts (the returned function).
 *
 * @param {Element} target
 * @returns {() => void} Ends the hold.
 */
export function holdAnchor(target) {
  releaseAnchor?.();

  let quiet;
  let released = false;
  const marginTop = () => Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  // The page coordinate the anchor should be scrolled to — independent of
  // where the page happens to be scrolled right now.
  const destination = () => target.getBoundingClientRect().top + window.scrollY - marginTop();
  let aimed = destination();

  const release = () => {
    released = true;
    if (releaseAnchor === release) releaseAnchor = null;
    clearTimeout(quiet);
    observer.disconnect();
    window.removeEventListener('load', onLoad);
    for (const type of TAKEOVER_EVENTS) window.removeEventListener(type, release, true);
  };
  // Only counts down once the page has loaded: `load` may still be seconds
  // away on a slow connection, and it is the event that matters most.
  const armQuiet = () => {
    if (document.readyState !== 'complete') return;
    clearTimeout(quiet);
    quiet = setTimeout(release, HOLD_QUIET_MS);
  };
  const aim = ({ always }) => {
    if (released) return;
    // The route swap that removes the target also resizes the body — which
    // is what fires this — before the hook that owns the hold has been told.
    if (!target.isConnected) {
      release();
      return;
    }
    const next = destination();
    if (!always && Math.abs(next - aimed) <= 1) return;
    aimed = next;
    const lenis = getLenis();
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  };
  const onLoad = () => setTimeout(() => {
    aim({ always: true });
    armQuiet();
  }, 0);

  const observer = new ResizeObserver(() => {
    aim({ always: false });
    armQuiet();
  });

  releaseAnchor = release;
  for (const type of TAKEOVER_EVENTS) window.addEventListener(type, release, { capture: true, passive: true });
  observer.observe(document.body);
  if (document.readyState !== 'complete') window.addEventListener('load', onLoad, { once: true });
  document.fonts?.ready.then(() => aim({ always: false }));
  return release;
}

/**
 * Ends any anchor hold. Called the moment a navigation commits (a layout
 * effect), ahead of anything the new page's layout could trigger in it.
 */
export function releaseAnchorHold() {
  releaseAnchor?.();
}

/**
 * Cancels whatever Lenis is animating and adopts the real scroll position.
 *
 * A new navigation supersedes any scroll still in flight. Lenis does not
 * reliably do that for us: `scrollTo(0, { immediate: true })` returns early —
 * without stopping the animation — whenever the requested value equals its
 * `targetScroll`, and a programmatic animation's `targetScroll` only starts
 * following it on its first frame. So a link followed within a frame or two of
 * the previous one (`#capabilities`, then a project card) had its reset
 * silently ignored and the stale animation carried on to `#capabilities` on
 * the project page. Measured: about a third of those clicks, at 320px.
 */
export function cancelScrollMotion() {
  lenis?.reset();
}

// Where the page was scrolled to when an in-page navigation committed.
let scrollOrigin = null;

/**
 * Notes the current scroll position so `restoreScrollOrigin` can put it back.
 * Called by useRouteScrollReset, ahead of <ScrollRestoration />.
 */
export function captureScrollOrigin() {
  scrollOrigin = window.scrollY;
}

/**
 * Undoes <ScrollRestoration />'s native jump to a hash target, in the same
 * commit and therefore before anything is painted.
 *
 * That component calls `scrollIntoView()` on every hash navigation. With
 * native scrolling instant (base.css) it lands the page on the target at once,
 * leaving Lenis nothing to animate — the smooth glide to `#work` and the rest
 * would become a jump. Putting the page back where it was hands Lenis (see
 * useHashScroll) the start of the glide, exactly as if the router had never
 * scrolled.
 */
export function restoreScrollOrigin() {
  if (scrollOrigin === null) return;
  const y = scrollOrigin;
  scrollOrigin = null;
  if (window.scrollY !== y) window.scrollTo({ top: y, behavior: 'instant' });
}
