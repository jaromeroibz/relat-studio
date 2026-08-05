/**
 * Locale registry.
 *
 * English ships now. The structure exists so Spanish can be added by writing
 * `src/data/es/*.js` and adding `'es'` here — no component, route or layout
 * needs to change. See src/data/README.md for the contract.
 */

export const DEFAULT_LOCALE = 'en';

/** Locales with a complete content bundle. */
export const SUPPORTED_LOCALES = ['en'];

/** @param {string} locale */
export function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}
