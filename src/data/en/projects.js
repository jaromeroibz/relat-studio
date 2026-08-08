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
 *   screens    a set of screens on a shared ground; side by side from `md`,
 *              stacked below it so they stay readable on a phone.
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
    category: 'Hospitality Website',
    description: 'A hostel website that has to sell rooms, not just show them.',

    // Factual only. The palette and typefaces below are the project's real
    // tokens, read from the Gecko codebase — not approximated. No outcome, no
    // metric, no quote. The Lodgify note describes the connection and stops
    // there; nothing claims a result.
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
        // The footer carries the identity better than any specimen would —
        // the wordmark, the display italic and the ground colour in one frame.
        type: 'media',
        media: 'ui-type',
        width: 'wide',
        aspect: '12 / 5',
        caption: 'Typography and identity in context',
      },
      {
        type: 'statement',
        text: 'Finding a room.',
      },
      {
        // Kept at its native proportion. The interface has to stay readable —
        // cropping it harder would turn a working page into an abstraction.
        type: 'media',
        media: 'rooms-index',
        width: 'wide',
        aspect: '8 / 5',
        caption: 'Room discovery with live availability',
      },
      {
        type: 'statement',
        text: 'Then booking it.',
      },
      {
        // Discovery -> availability -> booking. Full bleed, uncropped: this is
        // the part of the project that has to work, not just look considered.
        type: 'media',
        media: 'booking-calendar',
        width: 'full',
        aspect: '8 / 5',
        caption: 'Room detail and date selection',
      },
      {
        // The same panel, close. An interface detail rather than a page.
        type: 'media',
        media: 'booking-summary',
        width: 'inset',
        aspect: '1 / 1',
        caption: 'Pricing and availability',
      },
      {
        type: 'note',
        text: 'Booking and availability connect through Lodgify, creating a continuous path from room discovery to reservation.',
      },
      {
        type: 'statement',
        text: 'On a phone, at the door.',
      },
      {
        // Side by side from `md`, stacked below it. Gecko's own cream is the
        // ground, so the arrangement can change without re-exporting a
        // composite.
        type: 'screens',
        media: ['mobile-home', 'mobile-rooms', 'mobile-booking'],
        aspect: '900 / 1950',
        ground: '#f4f1ea',
        caption: 'Home, rooms and booking on mobile',
      },
    ],
  },

  bolaca: {
    title: 'Bolaca',
    category: 'E-commerce',
    description: 'A Chilean shop for children’s games and books, built around browsing and buying.',

    // Factual only. Written from the live storefront: a catalogue of games,
    // books and didactic cards, filtered by brand, category, recommended age
    // and price, with stock state on the product page and two ways to buy.
    // No outcome, no metric, no quote. Roles and year are unconfirmed and
    // stated nowhere.
    //
    // Where Scotty is identity and Gecko is booking, Bolaca is the catalogue:
    // discovery -> product -> decision -> cart. The products are the
    // protagonist, so the sequence alternates full interface views with
    // tighter crops rather than running a column of full-page screenshots.
    story: [
      {
        type: 'statement',
        text: 'A shop for children’s games and books.',
      },
      {
        type: 'media',
        media: 'storefront',
        width: 'full',
        aspect: '16 / 9',
        pending: 'Storefront',
      },
      {
        type: 'statement',
        text: 'Finding the right one.',
      },
      {
        type: 'media',
        media: 'catalogue',
        width: 'wide',
        aspect: '8 / 5',
        caption: 'Catalogue, filtered',
        pending: 'Catalogue',
      },
      {
        // The clearest piece of thinking in the project: children's products
        // filtered by recommended age, not only by category and price.
        type: 'media',
        media: 'filters',
        width: 'inset',
        aspect: '3 / 4',
        caption: 'Brand, category, recommended age, price',
        pending: 'Filter panel',
      },
      {
        type: 'statement',
        text: 'Then the product itself.',
      },
      {
        type: 'media',
        media: 'product-detail',
        width: 'wide',
        aspect: '8 / 5',
        caption: 'Product, price and availability',
        pending: 'Product detail',
      },
      {
        type: 'media',
        media: 'product-card',
        width: 'inset',
        aspect: '1 / 1',
        caption: 'One card, close',
        pending: 'Product card',
      },
      {
        type: 'statement',
        text: 'Into the cart.',
      },
      {
        type: 'media',
        media: 'cart',
        width: 'wide',
        aspect: '8 / 5',
        caption: 'Cart',
        pending: 'Cart',
      },
      {
        type: 'statement',
        text: 'And on a phone.',
      },
      {
        // Side by side from md, stacked below it — the Gecko fix, reused.
        type: 'screens',
        media: ['mobile-home', 'mobile-catalogue', 'mobile-product'],
        aspect: '900 / 1950',
        ground: '#f2eee8',
        caption: 'Storefront, catalogue and product on mobile',
      },
    ],
  },
};
