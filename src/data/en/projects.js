/**
 * Project copy and story composition — English.
 *
 * Keyed by the `slug` in src/data/projects.js.
 *
 * A story is a sequence of typed blocks. This is the portfolio system: future
 * projects are written, not built. Every block shares the site's typography,
 * spacing, motion and reveal language, so a new project fits the system by
 * default and expresses itself through its atmosphere and its imagery.
 *
 * Block types (see src/components/work/story/):
 *
 *   statement  a short line set large. Typography as image. One idea.
 *   media      one image. width: 'full' | 'wide' | 'inset'. Optional caption.
 *   pair       two images, vertically offset so the pair has rhythm.
 *   note       a small observation set in mono, beside whitespace.
 *
 * Copy rules: statements are short. Notes are shorter. Nothing here claims a
 * result, a metric or an outcome, and nothing describes work that has not been
 * done. A project with no `story` has no page yet — it appears in the index
 * and does not link anywhere.
 *
 * @typedef {object} ProjectCopy
 * @property {string} title
 * @property {string} category    One or two words. Shown as metadata.
 * @property {string} description One line. Shown in the index.
 * @property {StoryBlock[]} [story]
 */

/** @type {Record<string, ProjectCopy>} */
export const projectCopy = {
  'scotty-grand': {
    title: 'Scotty Grand',
    category: 'Artist Website',
    description: 'An artist website built around identity, photography and motion.',

    // PROVISIONAL COPY. Every line below is drawn from what is confirmed about
    // the project — that it is an artist website, in progress, with RELAT on
    // strategy, design and development, and that its emphasis is identity,
    // photography, motion and craft. Replace with the real narrative once the
    // work is further along.
    story: [
      {
        type: 'statement',
        text: 'An artist website.',
      },
      {
        type: 'media',
        media: 'portrait',
        width: 'full',
        aspect: '3 / 2',
        caption: 'Photography — pending',
      },
      {
        type: 'statement',
        text: 'Identity first.',
      },
      {
        type: 'pair',
        media: ['site-home', 'site-detail'],
        aspect: '4 / 5',
      },
      {
        type: 'note',
        text: 'Strategy, design and development by RELAT.',
      },
      {
        type: 'media',
        media: 'typography',
        width: 'wide',
        aspect: '16 / 9',
        caption: 'Type and identity detail — pending',
      },
      {
        type: 'statement',
        text: 'In progress.',
      },
    ],
  },

  'gecko-surf-house': {
    title: 'Gecko Surf House',
    category: 'Hospitality',
    description: 'Slot for a completed hospitality project.',
  },

  bolaca: {
    title: 'Bolaca',
    category: 'E-commerce',
    description: 'Slot for a completed e-commerce project.',
  },
};
