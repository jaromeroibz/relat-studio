/**
 * Behavioural analytics — one door into Google Tag Manager's `dataLayer`.
 *
 * GTM (root.jsx) is the single tracking container: GA4 and Microsoft Clarity
 * both load through it, so nothing here talks to either directly. This file
 * only pushes plain event objects; what GTM does with them is configured in
 * GTM, not in code.
 *
 * Safe to call from anywhere: a no-op during prerender/SSR, and never throws
 * (a blocked or missing `dataLayer` must not be able to break a click, a
 * route change or a form). Silent by design — no logging.
 *
 * Privacy: events describe *behaviour*, never people. Nothing a visitor typed
 * — name, email, message, phone — is ever an event parameter, and the
 * denylist below is a backstop against that changing by accident, not the
 * primary safeguard (call sites simply never pass those values).
 */

const PII_KEYS = /^(name|full_?name|first_?name|last_?name|email|e_?mail|phone|tel|message|company|project|address)$/i;

/** The current route, for `page_path` parameters. */
export function currentPath() {
  return typeof window === 'undefined' ? undefined : window.location.pathname;
}

/**
 * @param {string} eventName
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  try {
    const safe = {};
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || PII_KEYS.test(key)) continue;
      safe[key] = value;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...safe });
  } catch {
    // Analytics must never be able to break the site.
  }
}
