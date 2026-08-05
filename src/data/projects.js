/**
 * Locale-neutral project facts.
 *
 * Copy for each project lives in `src/data/<locale>/projects.js`, keyed by
 * slug. Facts — dates, roles, credits, media — do not need translating and
 * live here so they can never disagree between languages.
 *
 * ---------------------------------------------------------------------------
 * CONTENT HONESTY
 *
 * Never add a project that RELAT did not work on. Never invent a client,
 * metric, testimonial or result.
 *
 * Work that predates RELAT may appear as Selected Work. That is why
 * `attribution` is required rather than optional: the UI reads it directly,
 * so a pre-RELAT project cannot be rendered as studio work by omission.
 * ---------------------------------------------------------------------------
 *
 * @typedef {object} Project
 * @property {string} slug           URL segment. Stable — it is a permalink.
 * @property {string} client         Real client or business name.
 * @property {number} year           Year the work shipped.
 * @property {string[]} roles        What was actually done, e.g. ['Design', 'Development'].
 * @property {'relat'|'prior-work'} attribution
 *   `relat`      — completed as RELAT.
 *   `prior-work` — completed before RELAT existed. The UI labels it as such.
 * @property {string} [url]          Live site, if it is still live and current.
 * @property {string[]} [industries] For filtering. Not shown as a badge.
 * @property {ProjectMedia} media
 * @property {boolean} [featured]    Appears in Selected Work on the homepage.
 *
 * @typedef {object} ProjectMedia
 * @property {ProjectImage} cover    The index image.
 * @property {ProjectImage[]} [gallery] Revealed on hover and in the case study.
 *
 * @typedef {object} ProjectImage
 * @property {string} src
 * @property {string} alt            Describes the image, not the project.
 * @property {number} width          Required — protects CLS.
 * @property {number} height         Required — protects CLS.
 */

/**
 * Selected Work.
 *
 * Empty until real projects are supplied. The portfolio system is complete and
 * driven entirely by this array — adding an entry is the only step required.
 *
 * @type {Project[]}
 */
export const projects = [];

/** @param {string} slug */
export function getProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

/** Projects marked for the homepage, newest first. */
export function getFeaturedProjects(limit = 3) {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}
