import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { useMotion } from '../../lib/motion-context.js';

// One frame's whole slot: ~1.5s fully visible plus the 320ms crossfade
// (--duration-base, see project-feature.css). It was 700ms with a 200ms fade —
// a slideshow; this is an editorial sequence, where each image can be read
// before the next begins.
const FRAME_MS = 1850;

/**
 * A project's media window, capable of revealing more of that same project
 * on hover.
 *
 * REST: the curated cover image for this slot. HOVER (desktop, fine pointer,
 * motion allowed): the window cycles through the rest of `images` — one
 * project's own material becoming unexpectedly alive — and resolves back to
 * the cover the moment the pointer leaves. The window itself never moves,
 * resizes, or reflows; only which stacked image is opaque changes. No
 * autoplay, no controls, no cursor-position scrubbing — studied against
 * https://kuehlunddeng.ch/cases, whose own restraint (a project photo that
 * only ever answers to the pointer, nothing ambient) is the quality worth
 * keeping even though that reference's own cards don't cycle multiple
 * images — see the implementation report.
 *
 * Below `hover:hover`/`pointer:fine`, or with a single-image slot, this
 * renders just the cover — no stack, no extra bytes fetched. That is also
 * the complete reduced-motion and no-JS experience.
 *
 * `maskRef`/`innerRef` are forwarded straight through to
 * useProjectFeatureChoreography's scroll entrance/shift — this component
 * only ever adds the hover behaviour on top of that existing mask/scale
 * mechanism, it doesn't replace it.
 *
 * @param {object} props
 * @param {{src:string, alt:string, width:number, height:number, objectPosition?:string}[]} props.images
 *   The first is the cover — the only one used when the reel is off, and the
 *   only one with real alt text when it's on.
 * @param {import('react').RefObject<HTMLElement>} props.maskRef
 * @param {import('react').RefObject<HTMLElement>} props.innerRef
 * @param {string} [props.aspect]
 * @param {boolean} [props.eager] LCP-critical cover (the first project's hero).
 * @param {string} [props.maskClassName]
 */
export function ProjectMediaReel({ images, maskRef, innerRef, aspect, eager = false, maskClassName }) {
  const { allowHover } = useMotion();
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const preloadedRef = useRef(false);

  const reelEnabled = allowHover && images.length > 1;
  const frames = reelEnabled ? images : images.slice(0, 1);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function preload() {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    for (const frame of frames.slice(1)) {
      const warm = new Image();
      warm.src = frame.src;
    }
  }

  function handleEnter() {
    if (!reelEnabled) return;
    preload();
    clearTimer();
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % frames.length);
    }, FRAME_MS);
  }

  function handleLeave() {
    clearTimer();
    setActive(0);
  }

  useEffect(() => clearTimer, []);

  if (images.length === 0) return null;

  return (
    <div
      ref={maskRef}
      className={cn('project-feature__media-mask relative', maskClassName)}
      style={{ aspectRatio: aspect }}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <div ref={innerRef} className="project-feature__media-inner absolute inset-0">
        {frames.map((frame, i) => (
          <img
            key={frame.src}
            src={frame.src}
            alt={i === 0 ? frame.alt : ''}
            aria-hidden={i === 0 ? undefined : 'true'}
            width={frame.width}
            height={frame.height}
            loading={eager && i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="project-feature__reel-frame absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: frame.objectPosition,
              opacity: i === active ? 1 : 0,
              filter: 'var(--media-filter, none)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
