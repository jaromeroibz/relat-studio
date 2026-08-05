/**
 * WCAG contrast maths.
 *
 * The system page uses this to measure the palette in the browser rather than
 * trusting a comment in a stylesheet. If a pairing fails, it says so on screen.
 */

/**
 * Parses a computed colour string — `rgb(16, 14, 12)` or `rgba(16, 14, 12, .12)`.
 * Computed styles are always resolved to rgb/rgba, so no other format is needed.
 *
 * @param {string} value
 * @returns {[number, number, number, number] | null} [r, g, b, alpha]
 */
export function parseColor(value) {
  const match = String(value).match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.%]+))?\s*\)/i
  );
  if (!match) return null;

  let alpha = 1;
  if (match[4] != null) {
    alpha = match[4].endsWith('%')
      ? Number.parseFloat(match[4]) / 100
      : Number.parseFloat(match[4]);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3]), alpha];
}

/**
 * Composites a possibly-translucent colour over an opaque backdrop.
 * Semi-transparent rules and hairlines have to be measured as they appear.
 */
export function flatten([r, g, b, a], backdrop) {
  if (a >= 1) return [r, g, b];
  const [br, bg, bb] = backdrop;
  return [
    r * a + br * (1 - a),
    g * a + bg * (1 - a),
    b * a + bb * (1 - a),
  ];
}

/** @param {number[]} rgb */
export function relativeLuminance([r, g, b]) {
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * @param {number[]} foreground rgb
 * @param {number[]} background rgb
 * @returns {number} ratio between 1 and 21
 */
export function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * @param {number} ratio
 * @param {{ large?: boolean, nonText?: boolean, decorative?: boolean }} [options]
 * @returns {'AAA'|'AA'|'AA Large'|'Decorative'|'Fail'}
 */
export function wcagLevel(ratio, { large = false, nonText = false, decorative = false } = {}) {
  // WCAG 1.4.11 exempts purely decorative divisions. A rule that separates
  // content carries no information a control boundary does.
  if (decorative) return 'Decorative';
  if (nonText) return ratio >= 3 ? 'AA' : 'Fail';
  if (large) {
    if (ratio >= 4.5) return 'AAA';
    return ratio >= 3 ? 'AA' : 'Fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

/**
 * Measures the contrast between two custom properties as they resolve inside
 * `element` — which means inside whatever theme that element sits in.
 *
 * @param {HTMLElement} element
 * @param {string} fgProperty e.g. '--fg-muted'
 * @param {string} bgProperty e.g. '--bg'
 */
export function measureContrast(element, fgProperty, bgProperty) {
  const styles = getComputedStyle(element);

  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;opacity:0;pointer-events:none';
  element.appendChild(probe);

  const resolve = (property) => {
    probe.style.color = '';
    probe.style.color = `var(${property})`;
    return parseColor(getComputedStyle(probe).color);
  };

  const foreground = resolve(fgProperty);
  const background = resolve(bgProperty);
  probe.remove();

  if (!foreground || !background) return null;

  const backdrop = flatten(background, [255, 255, 255]);
  const ratio = contrastRatio(flatten(foreground, backdrop), backdrop);

  return {
    ratio,
    foreground: styles.getPropertyValue(fgProperty).trim(),
    background: styles.getPropertyValue(bgProperty).trim(),
  };
}
