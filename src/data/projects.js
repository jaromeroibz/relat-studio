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
 * `attribution` is required rather than optional because the UI reads it
 * directly — a project cannot be rendered as studio work by omission:
 *
 *   relat        completed as RELAT
 *   prior-work   completed before RELAT existed; labelled as such
 *   placeholder  not a project at all. A composition slot holding space until
 *                real work is supplied. The UI marks it visibly.
 *
 * The entries below are ALL placeholders. Their titles describe a *kind* of
 * project, not a client — no business named here is a RELAT client, and none
 * is presented as one.
 * ---------------------------------------------------------------------------
 *
 * @typedef {object} Project
 * @property {string} slug           URL segment. Stable — it is a permalink.
 * @property {string} client         Real client or business name.
 * @property {number|null} year      Year the work shipped.
 * @property {string[]} roles        What was actually done, e.g. ['Design', 'Development'].
 * @property {'relat'|'prior-work'|'placeholder'} attribution
 * @property {string} [url]          Live site, if it is still live and current.
 * @property {string[]} [industries] For filtering. Not shown as a badge.
 * @property {'lead'|'standard'|'quiet'} emphasis
 *   Composition weight. This is what gives the index its rhythm — `lead`
 *   projects dominate, `quiet` ones recede. It is a layout decision, so it
 *   lives with the facts rather than the copy.
 * @property {ProjectMediaSet} media
 * @property {boolean} [featured]    Appears in Selected Work on the homepage.
 *
 * @typedef {object} ProjectMediaSet
 * @property {ProjectImage|null} cover   The index image. `null` renders a placeholder.
 * @property {ProjectImage[]} [gallery]  Additional imagery, for the case study.
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
 * To add a real project: replace an entry wholesale, set `attribution` to
 * `relat` or `prior-work`, fill `media.cover` with a real image, and add the
 * matching copy in `src/data/en/projects.js` under the same slug. Nothing else
 * needs to change — emphasis drives the composition.
 *
 * @type {Project[]}
 */
export const projects = [
  {
    slug: 'placeholder-hospitality',
    client: 'Placeholder',
    year: null,
    roles: [],
    attribution: 'placeholder',
    emphasis: 'lead',
    featured: true,
    media: { cover: null, gallery: [] },
  },
  {
    slug: 'placeholder-commerce',
    client: 'Placeholder',
    year: null,
    roles: [],
    attribution: 'placeholder',
    emphasis: 'standard',
    featured: true,
    media: { cover: null, gallery: [] },
  },
  {
    slug: 'placeholder-studio',
    client: 'Placeholder',
    year: null,
    roles: [],
    attribution: 'placeholder',
    emphasis: 'quiet',
    featured: true,
    media: { cover: null, gallery: [] },
  },
  {
    slug: 'placeholder-identity',
    client: 'Placeholder',
    year: null,
    roles: [],
    attribution: 'placeholder',
    emphasis: 'standard',
    featured: true,
    media: { cover: null, gallery: [] },
  },
];

/** @param {string} slug */
export function getProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

/** Projects marked for the homepage, in authored order. */
export function getFeaturedProjects(limit = 4) {
  return projects.filter((project) => project.featured).slice(0, limit);
}

/**
 * Projects with a case study worth a page of their own.
 * Placeholders never qualify, which is what keeps empty routes out of the
 * prerender list.
 */
export function getProjectsWithCaseStudy() {
  return projects.filter((project) => project.attribution !== 'placeholder');
}
