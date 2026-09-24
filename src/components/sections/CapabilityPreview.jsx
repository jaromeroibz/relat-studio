import { cn } from '../../lib/cn.js';

/**
 * Capabilities' fixed media panel — the one reusable DOM node, stationary
 * in the right column, populated by useCapabilityMedia.js. It never moves
 * and is never hidden; only which image is showing (and the slide between
 * images) ever changes.
 *
 * The two layers are a directional vertical slide, not a crossfade —
 * exactly one is ever at rest (`yPercent: 0`) while the other is parked
 * off-frame above or below, so switching image slides the new one in
 * past the old one rather than dissolving between them. See
 * useCapabilityMedia.js for the direction/interrupt logic.
 *
 * The layers carry no CSS transform of their own — GSAP's `yPercent` is
 * the only thing that ever positions them. A stylesheet-authored
 * transform on the same element would break GSAP's first touch (it can't
 * fold a transform it didn't write into its own x/y model, so it freezes
 * the old one and composes on top instead of replacing it) — the same bug
 * this codebase has hit before wherever GSAP and CSS both reach for
 * `transform` on one element.
 *
 * @param {object} props
 * @param {[import('react').RefObject<HTMLElement>, import('react').RefObject<HTMLElement>]} props.layerRefs
 * @param {[object, object]} props.layers Two image descriptors (or
 *   `null`), from capabilityPreviews.js — `{src, alt, width, height}` —
 *   indexed to match `layerRefs`.
 * @param {string} [props.className]
 */
export function CapabilityMediaPanel({ layerRefs, layers, className }) {
  return (
    <div className={cn('capability-media relative overflow-hidden', className)}>
      {layers.map((image, i) => (
        <div key={i} ref={layerRefs[i]} className="capability-media__layer">
          {/* Keyed by the image itself, not the slot: a slot is reused
            * across capabilities (useCapabilityMedia's two-layer ping-pong),
            * but its `src` must never be *updated* on an existing node —
            * that leaves the old bitmap decoded and paintable for however
            * long the new one takes to replace it. A key change forces React
            * to unmount and remount the tag instead, so the slot can only
            * ever show this exact image or nothing. */}
          {image ? <MediaImage key={image.src} image={image} /> : null}
        </div>
      ))}
    </div>
  );
}

/**
 * The image at its own natural aspect ratio — never stretched or letterboxed
 * into a frame (see capability-preview.css). It carries the source
 * component's corner radius, as a percentage pair so the corner stays
 * circular at any rendered size, and a hairline only when it is itself
 * white enough to dissolve into the page.
 */
function MediaImage({ image }) {
  const radius = image.radius
    ? { borderRadius: `${(image.radius / image.width) * 100}% / ${(image.radius / image.height) * 100}%` }
    : undefined;

  return (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      width={image.width}
      height={image.height}
      style={radius}
      className={cn('capability-image', image.frame && 'capability-image--framed')}
    />
  );
}
