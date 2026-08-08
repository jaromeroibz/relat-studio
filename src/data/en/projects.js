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
 *   palette    a project's real colours and typefaces, shown as material.
 *   note       a small observation set in mono, beside whitespace.
 *
 * Media blocks accept `pending`: the label a not-yet-supplied image shows in
 * its slot. Naming the shot is more useful than "image pending".
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
    description: 'A hostel website that has to sell rooms, not just show them.',

    // PROVISIONAL COPY. Factual only. The palette and typefaces below are the
    // project's real tokens, read from the Gecko codebase — not approximated.
    // No outcome, no metric, no quote. Roles are unconfirmed and therefore
    // stated nowhere.
    //
    // Where Scotty demonstrates identity and art direction, Gecko demonstrates
    // hospitality UX: discovery, availability, booking, and the integration
    // underneath it. The interface is the hero material; the property is not
    // the subject.
    story: [
      {
        type: 'statement',
        text: 'A hostel site has a job to do.',
      },
      {
        type: 'media',
        media: 'site-home',
        width: 'full',
        aspect: '16 / 9',
        pending: 'Homepage — full browser',
      },
      {
        type: 'statement',
        text: 'Warm, and legible at speed.',
      },
      {
        // The project's real tokens, shown as material rather than as a spec.
        type: 'palette',
        colors: [
          { name: 'Cream', value: '#f4f1ea' },
          { name: 'Sand', value: '#e6e1d6' },
          { name: 'Mist', value: '#dce6df' },
          { name: 'Sage light', value: '#a8c9b0' },
          { name: 'Sage', value: '#7d9d86' },
          { name: 'Clay', value: '#b85c3a' },
          { name: 'Forest', value: '#1e3d32' },
          { name: 'Forest deep', value: '#142923' },
        ],
        typefaces: [
          { role: 'Navigation', name: 'Bebas Neue' },
          { role: 'Display', name: 'Comfortaa' },
          { role: 'Text', name: 'DM Sans' },
          { role: 'Labels', name: 'Nunito' },
        ],
      },
      {
        type: 'pair',
        media: ['ui-type', 'ui-detail'],
        aspect: '4 / 5',
        pending: ['Typography in place', 'Interface detail'],
      },
      {
        type: 'statement',
        text: 'Finding a room.',
      },
      {
        type: 'media',
        media: 'rooms-index',
        width: 'wide',
        aspect: '16 / 9',
        caption: 'Room discovery',
        pending: 'Rooms index',
      },
      {
        type: 'media',
        media: 'room-detail',
        width: 'inset',
        aspect: '16 / 10',
        caption: 'Room detail',
        pending: 'Room detail',
      },
      {
        type: 'statement',
        text: 'Then booking it.',
      },
      {
        // The strongest moment of the story: availability and booking are the
        // reason the site exists.
        type: 'pair',
        media: ['booking-calendar', 'booking-summary'],
        aspect: '4 / 5',
        pending: ['Availability calendar', 'Booking summary'],
      },
      {
        type: 'media',
        media: 'lodgify-sync',
        width: 'wide',
        aspect: '16 / 9',
        caption: 'Availability and reservations sync with Lodgify',
        pending: 'Lodgify integration',
      },
      {
        type: 'statement',
        text: 'On a phone, at the door.',
      },
      {
        type: 'media',
        media: 'responsive-set',
        width: 'wide',
        aspect: '16 / 9',
        caption: 'Responsive',
        pending: 'Mobile screens',
      },
    ],
  },

  bolaca: {
    title: 'Bolaca',
    category: 'E-commerce',
    description: 'Slot for a completed e-commerce project.',
  },
};
