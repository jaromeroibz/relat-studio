/**
 * Joins class names, dropping anything falsy.
 * Small on purpose — the project has no need for class-merging machinery.
 *
 * @param {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
