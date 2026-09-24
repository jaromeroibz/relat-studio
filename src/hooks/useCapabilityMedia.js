import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMotion } from '../lib/motion-context.js';
import { getCapabilityImages, getDefaultCapabilityPreviewSrcs } from '../lib/capabilityPreviews.js';

// Matches --duration-base / --ease-out-quint (tokens.css) — the same
// directional-slide vocabulary as before, just now driving a stationary
// panel's internal images instead of a cursor-follow container.
const SLIDE_DURATION = 0.32;
const SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// How long a capability's first image holds before the internal cycle
// reveals its second — within the requested ~1.5–2s.
const CYCLE_HOLD_MS = 1750;

/**
 * Capabilities' fixed media panel — the interaction, not the markup.
 *
 * Unlike the cursor-follow version this replaces, the panel never moves
 * and is never hidden: it always shows the active capability's image,
 * defaulting to the first capability at rest rather than an empty box.
 * There is exactly one state that matters here — `active`, the same list
 * index Capabilities.jsx already tracks for the description/tags panel —
 * so hover, click and keyboard focus all reach this hook the same way
 * they already reach that one, with no separate pointer/focus plumbing.
 *
 * Two things happen on top of that shared `active` value:
 *
 * 1. Changing capability slides the new image in from the edge matching
 *    list direction (down the list → rises from below; up → descends
 *    from above) while the old one exits the opposite edge.
 * 2. While a capability stays active, its own two images alternate on a
 *    timer, always in the same upward direction (never reversed) — a
 *    slow, deliberate cycle, not a carousel. Changing capability cancels
 *    and resets this immediately; it always loses to rule 1.
 *
 * Both are the same two-layer directional slide (`transitionTo` below),
 * driven by `gsap.killTweensOf` + fresh tweens each time so a fast run
 * through several capabilities interrupts cleanly instead of queuing.
 *
 * @param {object} params
 * @param {import('react').RefObject<HTMLElement>} params.containerRef Scopes
 *   the preload-on-approach check.
 * @param {string[]} params.ids Every capability id, in list order.
 * @param {number} params.active The active capability's index.
 */
export function useCapabilityMedia({ containerRef, ids, active }) {
  const { isDesktop, prefersReducedMotion } = useMotion();

  const layerRefA = useRef(null);
  const layerRefB = useRef(null);
  // Stable across renders — used inside effects/callbacks below.
  const layerRefs = useMemo(() => [layerRefA, layerRefB], []);

  const gsapRef = useRef(null);
  const currentSlotRef = useRef(0);
  const lastActiveRef = useRef(null); // null until the mount effect runs
  const currentImageIndexRef = useRef(0);
  const cycleTimeoutRef = useRef(null);
  // Holds the latest scheduleCycle so its own setTimeout can call the
  // current version of itself without referencing the const before it's
  // declared (a plain recursive reference here trips the linter, since a
  // useCallback's own name isn't stable-by-identity until after it runs).
  const scheduleCycleRef = useRef(null);

  // Kept current in a *layout* effect, not the passive one below that
  // actually reacts to `active` changing. Layout effects flush synchronously
  // as part of the same commit that processed the hover's `setActive` —
  // before the browser is handed back to its own event loop — so this is
  // guaranteed correct before anything already scheduled on that loop (most
  // pointedly a still-armed cycle timeout from the capability the pointer
  // just left) gets a chance to run. The passive active-change effect, by
  // contrast, is flushed on its *own* later turn, and a cycle timeout
  // landing in exactly that gap is what let a just-abandoned capability's
  // own image-cycle tick start animating into the panel a beat before the
  // real capability-change transition arrived to redirect it — the visible
  // "wrong capability's image" flash. Reading this ref instead of trusting
  // that later effect's timing closes the gap: the timeout callback below
  // checks it first and no-ops if it's gone stale, so it can never start a
  // transition the real one would only have to interrupt.
  const activeIdRef = useRef(ids[active]);
  useLayoutEffect(() => {
    activeIdRef.current = ids[active];
  }, [active, ids]);

  const [layers, setLayers] = useState([null, null]);

  const setLayerContent = useCallback((slot, image) => {
    setLayers((prev) => {
      const next = [...prev];
      next[slot] = image ?? null;
      return next;
    });
  }, []);

  // Warm every capability's default image once the section is about to be
  // scrolled into view — the second image per capability loads only once
  // that capability is actually cycled to (see scheduleCycle below).
  useEffect(() => {
    if (!isDesktop) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        for (const src of getDefaultCapabilityPreviewSrcs(ids)) {
          const warm = new Image();
          warm.src = src;
        }
        io.disconnect();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef, isDesktop, ids]);

  // Load gsap once.
  useEffect(() => {
    if (!isDesktop) return;
    let cancelled = false;
    (async () => {
      const { gsap } = await import('gsap');
      if (!cancelled) gsapRef.current = gsap;
    })();
    return () => {
      cancelled = true;
      gsapRef.current = null;
    };
  }, [isDesktop]);

  const clearCycle = useCallback(() => {
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current);
      cycleTimeoutRef.current = null;
    }
  }, []);

  // The one shared transition: park `image` in whichever slot is currently
  // off-frame, slide it in from `enterFrom`, and slide the resting slot
  // out the opposite edge. Used for both capability changes and the
  // internal same-capability cycle — they differ only in which image and
  // which edge.
  //
  // Every step below happens in this one synchronous call, in the order
  // the capability-change effect needs: kill whatever's mid-flight (2),
  // hand the incoming slot its image before it's positioned (4), place it
  // off-frame (5), then animate both slots (6). `onSettled`, if given,
  // fires once the incoming slot has actually finished arriving (7) — not
  // a moment before, since starting a cycle mid-slide would be timing the
  // hold from the wrong instant.
  const transitionTo = useCallback(
    (image, enterFrom, { onSettled } = {}) => {
      const gsap = gsapRef.current;
      const currentSlot = currentSlotRef.current;
      const currentEl = layerRefs[currentSlot].current;
      const incomingSlot = 1 - currentSlot;
      const incomingEl = layerRefs[incomingSlot].current;

      const enterStartYPercent = enterFrom === 'below' ? 100 : -100;
      const exitYPercent = enterFrom === 'below' ? -100 : 100;
      const duration = prefersReducedMotion ? 0 : SLIDE_DURATION;

      // Stop whatever is mid-flight before redirecting — a fast run
      // through several capabilities (or a cycle tick landing mid-switch)
      // never queues, it just redirects cleanly.
      if (gsap) gsap.killTweensOf([currentEl, incomingEl]);

      setLayerContent(incomingSlot, image);
      gsap?.set(incomingEl, { yPercent: enterStartYPercent });
      gsap?.to(currentEl, { yPercent: exitYPercent, duration, ease: SLIDE_EASE, overwrite: 'auto' });
      gsap?.to(incomingEl, {
        yPercent: 0,
        duration,
        ease: SLIDE_EASE,
        overwrite: 'auto',
        onComplete: onSettled,
      });
      // No GSAP (SSR-ish edge, or the import hasn't resolved yet): nothing
      // will ever call onComplete, so the caller's "settled" step still
      // has to happen.
      if (!gsap) onSettled?.();

      currentSlotRef.current = incomingSlot;
    },
    [layerRefs, prefersReducedMotion, setLayerContent]
  );

  // Alternates a still-active capability's two images forever, always
  // sliding "up" (enters from below) regardless of which image is next —
  // a consistent progression, never reversed. `active` change always
  // cancels this first (see the effect below) — but that cancellation is
  // effect-timed, one render behind the hover that caused it, so a tick
  // scheduled for right about then can still fire in the gap. `activeIdRef`
  // (updated during render, ahead of that gap) is the actual guard: a tick
  // that fires for a capability the pointer has already left bails here,
  // before it ever touches a layer, rather than starting a transition the
  // real one would only have to interrupt a frame later.
  const scheduleCycle = useCallback(
    (capabilityId) => {
      clearCycle();
      if (prefersReducedMotion) return;
      const images = getCapabilityImages(capabilityId);
      if (images.length < 2) return;

      cycleTimeoutRef.current = setTimeout(() => {
        if (activeIdRef.current !== capabilityId) return;
        currentImageIndexRef.current = currentImageIndexRef.current === 0 ? 1 : 0;
        transitionTo(images[currentImageIndexRef.current], 'below');
        scheduleCycleRef.current?.(capabilityId);
      }, CYCLE_HOLD_MS);
    },
    [clearCycle, prefersReducedMotion, transitionTo]
  );
  // Keeps the ref current after every render — refs may not be written
  // during render itself, only in an effect or event handler.
  useEffect(() => {
    scheduleCycleRef.current = scheduleCycle;
  });

  // The one thing that drives everything: `active` changing (including
  // the very first render, which establishes the default state).
  useEffect(() => {
    if (!isDesktop) return;
    const id = ids[active];
    const images = getCapabilityImages(id);
    currentImageIndexRef.current = 0;
    // (1) Stop this capability's own cycle before anything else — a tick
    // still armed from the *previous* active effect instance (the one this
    // replaces) has no capability left to belong to.
    clearCycle();

    if (lastActiveRef.current === null) {
      // At rest: the first capability's first image, with no slide — this
      // is the default state, not a transition into it. Nothing is
      // animating in, so nothing to wait on before starting its cycle.
      const currentEl = layerRefs[currentSlotRef.current].current;
      const otherEl = layerRefs[1 - currentSlotRef.current].current;
      setLayerContent(currentSlotRef.current, images[0] ?? null);
      gsapRef.current?.set(currentEl, { yPercent: 0 });
      gsapRef.current?.set(otherEl, { yPercent: 100 });
      lastActiveRef.current = active;
      if (images.length >= 2) scheduleCycle(id);
      return clearCycle;
    }

    if (active !== lastActiveRef.current) {
      // (3)–(6): transitionTo determines/places/animates B in one call —
      // (7): only once it reports settled does B get its own cycle timer.
      const movingDown = active > lastActiveRef.current;
      transitionTo(images[0] ?? null, movingDown ? 'below' : 'above', {
        onSettled: () => {
          if (activeIdRef.current === id && images.length >= 2) scheduleCycle(id);
        },
      });
    }

    lastActiveRef.current = active;
    return clearCycle;
  }, [active, isDesktop, ids, transitionTo, scheduleCycle, clearCycle, layerRefs, setLayerContent]);

  return { showPanel: isDesktop, layerRefs, layers };
}
