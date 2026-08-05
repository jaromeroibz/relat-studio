/**
 * RELAT — motion tokens for JavaScript
 *
 * CSS owns the timing values (src/styles/tokens.css). This module reads them
 * back at runtime so GSAP timelines and CSS transitions are never out of sync.
 * Change a duration in tokens.css and the entire site re-times, including
 * anything scripted.
 *
 * Values are cached after first read — this is measured once, not per frame.
 */

/** Used during prerender and before first paint. Must mirror tokens.css. */
const FALLBACK = {
  durations: {
    instant: 100,
    fast: 200,
    base: 320,
    slow: 560,
    slower: 900,
    reveal: 1100,
    theme: 700,
  },
  revealDistance: 20,
};

/**
 * GSAP cannot consume `cubic-bezier()` strings without the CustomEase plugin.
 * Rather than ship a plugin to restate curves we already have, each CSS easing
 * is mapped to its closest GSAP equivalent. The pairs below are visually
 * equivalent — if you change one side, change the other.
 *
 *   --ease-out-expo      cubic-bezier(0.16, 1, 0.3, 1)   ≈ expo.out
 *   --ease-out-quint     cubic-bezier(0.22, 1, 0.36, 1)  ≈ quint.out
 *   --ease-in-out-quart  cubic-bezier(0.76, 0, 0.24, 1)  ≈ quart.inOut
 *   --ease-standard      cubic-bezier(0.4, 0, 0.2, 1)    ≈ power2.inOut
 */
export const GSAP_EASE = {
  outExpo: 'expo.out',
  outQuint: 'quint.out',
  inOutQuart: 'quart.inOut',
  standard: 'power2.inOut',
};

export const CSS_EASE = {
  outExpo: 'var(--ease-out-expo)',
  outQuint: 'var(--ease-out-quint)',
  inOutQuart: 'var(--ease-in-out-quart)',
  standard: 'var(--ease-standard)',
};

let cache = null;

/** Parses `"320ms"` / `"0.32s"` / `"1.25rem"` into a number. */
function parseCssValue(raw, { rootFontSize = 16 } = {}) {
  const value = String(raw).trim();
  if (!value) return null;

  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return null;

  if (value.endsWith('ms')) return numeric;
  if (value.endsWith('s')) return numeric * 1000;
  if (value.endsWith('rem')) return numeric * rootFontSize;
  return numeric;
}

/**
 * Reads the motion tokens from the document.
 * @returns {{ durations: Record<string, number>, revealDistance: number }}
 */
export function getMotionTokens() {
  if (cache) return cache;
  if (typeof window === 'undefined') return FALLBACK;

  const styles = getComputedStyle(document.documentElement);
  const rootFontSize =
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  const read = (name, fallback) =>
    parseCssValue(styles.getPropertyValue(name), { rootFontSize }) ?? fallback;

  cache = {
    durations: {
      instant: read('--duration-instant', FALLBACK.durations.instant),
      fast: read('--duration-fast', FALLBACK.durations.fast),
      base: read('--duration-base', FALLBACK.durations.base),
      slow: read('--duration-slow', FALLBACK.durations.slow),
      slower: read('--duration-slower', FALLBACK.durations.slower),
      reveal: read('--duration-reveal', FALLBACK.durations.reveal),
      theme: read('--duration-theme', FALLBACK.durations.theme),
    },
    revealDistance: read('--reveal-distance', FALLBACK.revealDistance),
  };

  return cache;
}

/** Duration in seconds, for GSAP. */
export function seconds(name) {
  return getMotionTokens().durations[name] / 1000;
}

/** Clears the cache. Only needed if tokens change at runtime (they don't). */
export function resetMotionTokens() {
  cache = null;
}
