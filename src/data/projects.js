/**
 * Locale-neutral project facts.
 *
 * Copy and story composition live in `src/data/<locale>/projects.js`, keyed by
 * slug. Facts — dates, roles, credits, media, atmosphere — do not need
 * translating and live here so they can never disagree between languages.
 *
 * ---------------------------------------------------------------------------
 * CONTENT HONESTY
 *
 * Never invent a client, a role, a year, a metric or a result. Fields that are
 * not yet known are `null` or empty, and the interface simply omits them —
 * a missing year renders as nothing, never as a guess.
 *
 * `attribution` is read directly by the UI so a project cannot be presented as
 * studio work by omission:
 *
 *   relat        completed, or currently being completed, as RELAT
 *   prior-work   completed before RELAT existed; labelled as such
 *   placeholder  not a project. A composition slot, visibly marked.
 * ---------------------------------------------------------------------------
 *
 * @typedef {object} Project
 * @property {string} slug            URL segment. Stable — it is a permalink.
 * @property {string} client          Real client or business name.
 * @property {number|null} year       Year the work shipped. null when unknown.
 * @property {string[]} roles         What was actually done. Empty when unconfirmed.
 * @property {'completed'|'in-progress'} status
 * @property {'relat'|'prior-work'|'placeholder'} attribution
 * @property {string} [url]           Live site, if it is live and current.
 * @property {'lead'|'standard'|'quiet'} emphasis
 *   Composition weight in the index. What gives the index its rhythm.
 * @property {'monochrome'|'natural'|'precise'} atmosphere
 *   The project's own air. See src/styles/atmospheres.css — an atmosphere may
 *   set ground, accent and image treatment, and nothing else.
 * @property {Record<string, ProjectImage|null>} media
 *   Keyed so story blocks can reference images by name. `null` means the asset
 *   is pending and renders a marked placeholder.
 * @property {boolean} [featured]     Appears in Selected Work on the homepage.
 *
 * @typedef {object} ProjectImage
 * @property {string} src
 * @property {string} alt             Describes the image, not the project.
 * @property {number} width           Required — protects CLS.
 * @property {number} height          Required — protects CLS.
 */

/** @type {Project[]} */
export const projects = [
  {
    slug: 'scotty-grand',
    client: 'Scotty Grand',
    year: 2026,
    roles: ['Strategy', 'Design', 'Development'],
    status: 'in-progress',
    attribution: 'relat',
    emphasis: 'lead',
    atmosphere: 'monochrome',
    featured: true,
    media: {
      // Real brand asset supplied by the client.
      wordmark: {
        src: '/projects/scotty-grand/wordmark.png',
        alt: 'Scotty Grand wordmark',
        width: 800,
        height: 85,
      },
      // The index shows the site as it opens. Same file as `site-home` — the
      // opening frame is the project's cover, so there is nothing to choose.
      cover: {
        src: '/projects/scotty-grand/site-home.jpg',
        alt: 'The Scotty Grand website opening on a full-screen black and white portrait beneath the wordmark',
        width: 2200,
        height: 1237,
      },
      'site-home': {
        src: '/projects/scotty-grand/site-home.jpg',
        alt: 'The Scotty Grand website opening on a full-screen black and white portrait beneath the wordmark',
        width: 2200,
        height: 1237,
      },
      'site-detail': {
        src: '/projects/scotty-grand/site-detail.jpg',
        alt: 'A section of the Scotty Grand site pairing the headline "Warm Up Your Voice Like a Pro" with a portrait',
        width: 2200,
        height: 1236,
      },

      // Pending. `portrait` needs the original black and white photography,
      // not a crop of the screenshot above.
      portrait: null,
    },
  },
  {
    slug: 'gecko-surf-house',
    client: 'Gecko Surf House',
    year: null,
    roles: [],
    status: 'completed',
    // Completed before RELAT existed. Confirm before changing.
    attribution: 'prior-work',
    emphasis: 'standard',
    atmosphere: 'natural',
    featured: true,
    media: { cover: null },
  },
  {
    slug: 'bolaca',
    client: 'Bolaca',
    year: null,
    roles: [],
    status: 'completed',
    attribution: 'prior-work',
    emphasis: 'standard',
    atmosphere: 'precise',
    featured: true,
    media: { cover: null },
  },
];

/** @param {string} slug */
export function getProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

/** Projects for the index, in authored order. */
export function getFeaturedProjects(limit) {
  const featured = projects.filter((project) => project.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * The project after this one, wrapping at the end. Drives the closing
 * transition on every project page, so the portfolio is a loop rather than a
 * set of dead ends.
 *
 * @param {string} slug
 */
export function getNextProject(slug) {
  const list = getFeaturedProjects();
  const index = list.findIndex((project) => project.slug === slug);
  if (index === -1 || list.length < 2) return null;
  return list[(index + 1) % list.length];
}
