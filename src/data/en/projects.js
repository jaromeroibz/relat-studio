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
 *   media      one image. width: 'full' | 'wide' | 'inset', fit: 'cover' |
 *              'contain'. Optional caption.
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
        // The site opens on the photograph, so the story does too.
        type: 'media',
        media: 'site-home',
        width: 'full',
        aspect: '16 / 9',
      },
      {
        type: 'statement',
        text: 'Identity first.',
      },
      {
        // The wordmark itself, on its own plate. `contain` because a mark is
        // not a photograph and must never be cropped to fill a frame.
        type: 'media',
        media: 'wordmark',
        width: 'inset',
        aspect: '21 / 9',
        fit: 'contain',
        caption: 'Wordmark',
      },
      {
        type: 'media',
        media: 'site-detail',
        width: 'wide',
        aspect: '16 / 9',
        caption: 'Warm Up Your Voice Like a Pro',
      },
      {
        type: 'note',
        text: 'Strategy, design and development by RELAT.',
      },
      {
        type: 'media',
        media: 'portrait',
        width: 'inset',
        aspect: '4 / 5',
        caption: 'Portrait',
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
    description: 'A surf house in Santa Teresa, and the site that had to feel like it.',

    // PROVISIONAL COPY. Factual only — the property, the place and the fact
    // that a hostel site has to handle rooms and availability. No outcome, no
    // metric, no quote. Roles are unconfirmed and therefore not stated
    // anywhere on the page.
    //
    // `site-home` and `site-booking` are pending full-resolution captures of
    // geckosurfhouse.com. They hold their slot rather than being filled with a
    // low-resolution screenshot.
    story: [
      {
        type: 'statement',
        text: 'A surf house in Santa Teresa.',
      },
      {
        type: 'media',
        media: 'courtyard',
        width: 'full',
        aspect: '16 / 9',
      },
      {
        type: 'statement',
        text: 'The site had to feel like the place.',
      },
      {
        type: 'pair',
        media: ['passage', 'door'],
        aspect: '4 / 5',
      },
      {
        type: 'media',
        media: 'hammock',
        width: 'wide',
        aspect: '16 / 9',
        caption: 'Common area',
      },
      {
        type: 'statement',
        text: 'Rooms, rates, availability.',
      },
      {
        type: 'pair',
        media: ['site-home', 'site-booking'],
        aspect: '16 / 10',
      },
      {
        type: 'media',
        media: 'tables',
        width: 'wide',
        aspect: '16 / 9',
      },
      {
        type: 'statement',
        text: 'Santa Teresa, Costa Rica.',
      },
    ],
  },

  bolaca: {
    title: 'Bolaca',
    category: 'E-commerce',
    description: 'Slot for a completed e-commerce project.',
  },
};
