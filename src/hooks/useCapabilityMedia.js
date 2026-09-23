import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const transitionTo = useCallback(
    (image, enterFrom) => {
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
      gsap?.to(incomingEl, { yPercent: 0, duration, ease: SLIDE_EASE, overwrite: 'auto' });

      currentSlotRef.current = incomingSlot;
    },
    [layerRefs, prefersReducedMotion, setLayerContent]
  );

  // Alternates a still-active capability's two images forever, always
  // sliding "up" (enters from below) regardless of which image is next —
  // a consistent progression, never reversed. `active` change always
  // cancels this first (see the effect below).
  const scheduleCycle = useCallback(
    (capabilityId) => {
      clearCycle();
      if (prefersReducedMotion) return;
      const images = getCapabilityImages(capabilityId);
      if (images.length < 2) return;

      cycleTimeoutRef.current = setTimeout(() => {
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
    clearCycle();

    if (lastActiveRef.current === null) {
      // At rest: the first capability's first image, with no slide — this
      // is the default state, not a transition into it.
      const currentEl = layerRefs[currentSlotRef.current].current;
      const otherEl = layerRefs[1 - currentSlotRef.current].current;
      setLayerContent(currentSlotRef.current, images[0] ?? null);
      gsapRef.current?.set(currentEl, { yPercent: 0 });
      gsapRef.current?.set(otherEl, { yPercent: 100 });
    } else if (active !== lastActiveRef.current) {
      const movingDown = active > lastActiveRef.current;
      transitionTo(images[0] ?? null, movingDown ? 'below' : 'above');
    }

    lastActiveRef.current = active;
    if (images.length >= 2) scheduleCycle(id);

    return clearCycle;
  }, [active, isDesktop, ids, transitionTo, scheduleCycle, clearCycle, layerRefs, setLayerContent]);

  return { showPanel: isDesktop, layerRefs, layers };
}
