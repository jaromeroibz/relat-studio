/**
 * `sizes` for project imagery — what width each slot actually renders at, so
 * the browser can pick a rendition from an image's `srcSet` before layout.
 *
 * These mirror the layout, not the image: the wide container is 96rem with a
 * `clamp(1.25rem, 4vw, 3rem)` gutter, so below 1200px a slot is ~92vw and above
 * it is the viewport less 96px until the container's own cap. They are upper
 * bounds on purpose — an over-estimate costs a slightly larger file, an
 * under-estimate costs a soft interface screenshot.
 */

/** A `wide` container slot: the story's full-measure media, and the next-project panel. */
export const SIZES_WIDE = '(min-width: 1632px) 1440px, (min-width: 1200px) calc(100vw - 96px), 92vw';

/** An edge-to-edge slot. */
export const SIZES_FULL = '100vw';

/** An `inset` slot (the narrow container). */
export const SIZES_INSET = '(min-width: 1000px) 800px, 92vw';

/** The index/service-page chapter media: 72vw to a 68rem cap from `lg`, 80vw from `md`. */
export const SIZES_FEATURE = '(min-width: 1512px) 1088px, (min-width: 1024px) 72vw, (min-width: 768px) 80vw, 92vw';

/**
 * A `stagger` item's slot: `span` of the twelve columns from `lg`; below that
 * the second item is pulled to 80% (`md`) or 88% (phone) of the measure.
 *
 * @param {number} span Columns it occupies on the grid.
 * @param {boolean} offset Whether it is the inset second item.
 */
export function staggerSizes(span, offset) {
  return [
    `(min-width: 1632px) ${Math.round((1440 * span) / 12)}px`,
    `(min-width: 1024px) ${Math.round((92 * span) / 12)}vw`,
    `(min-width: 768px) ${offset ? 74 : 92}vw`,
    `${offset ? 81 : 92}vw`,
  ].join(', ');
}
