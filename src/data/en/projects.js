/**
 * Project copy — English.
 *
 * Keyed by the `slug` in src/data/projects.js. Case studies follow
 * Challenge → Approach → Result and stay short: the work should carry the page.
 *
 * ---------------------------------------------------------------------------
 * Every entry below belongs to a PLACEHOLDER. The titles describe a kind of
 * project so the composition can be judged at realistic typographic length.
 * They are not clients, not RELAT projects, and carry no claims or results.
 * Replace them wholesale when real content arrives.
 * ---------------------------------------------------------------------------
 *
 * @typedef {object} ProjectCopy
 * @property {string} title      How the project is titled in the index.
 * @property {string} category   One or two words. Shown as metadata.
 * @property {string} description One line. Shown in the index.
 * @property {string} [challenge]
 * @property {string} [approach]
 * @property {string} [result]
 */

/** @type {Record<string, ProjectCopy>} */
export const projectCopy = {
  'placeholder-hospitality': {
    title: 'Coastal hospitality brand',
    category: 'Hospitality',
    description: 'Slot for a boutique stay — site, booking flow and photography direction.',
  },
  'placeholder-commerce': {
    title: 'Independent commerce',
    category: 'E-commerce',
    description: 'Slot for a product-led store with a real point of view.',
  },
  'placeholder-studio': {
    title: 'Artist and studio portfolio',
    category: 'Culture',
    description: 'Slot for a creative practice presenting a body of work.',
  },
  'placeholder-identity': {
    title: 'Identity and digital system',
    category: 'Brand',
    description: 'Slot for an identity extended into a working digital system.',
  },
};
