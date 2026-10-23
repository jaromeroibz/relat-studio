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
 *              'contain'. Optional caption. `priority: true` loads it eagerly
 *              and first — only for a measured above-the-fold LCP image.
 *   pair       two images, vertically offset so the pair has rhythm.
 *   palette    a project's real colours and typefaces, shown as material.
 *   screens    a set of screens on a shared ground; side by side from `md`,
 *              stacked below it so they stay readable on a phone.
 *   note       a small observation set in mono, beside whitespace.
 *   passage    a short passage of prose: an optional label and heading, then
 *              paragraphs. The heading is a real `h2`; omit it to continue the
 *              block above. `variant: 'display'` sets the heading large.
 *   opening    the project's line, set large, with a short introduction.
 *   stagger    two screens on a diagonal, placed on the twelve-column grid
 *              with `placement: [[start, span], [start, span]]`. Never crops.
 *   handsets   a passage beside two phone screens.
 *   chapter    a run of nested `blocks` on a dark ground of its own.
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
 * @property {string[]} [titleLines] The title broken into authored lines, for one too long for a single row.
 * @property {string} category    One or two words. Shown as metadata.
 * @property {string} description One line. Shown in the index.
 * @property {{ title?: string, description?: string, imageAlt?: string }} [seo]
 *   A search title and description of their own, when the index line and the
 *   short title are not what search should read. `title` is used as written.
 *   `imageAlt` is what the share image (the project's cover) shows, published
 *   as `og:image:alt`.
 * @property {StoryBlock[]} [story]
 */

/** @type {Record<string, ProjectCopy>} */
export const projectCopy = {
  'scotty-grand': {
    title: 'Scotty Grand',
    category: 'Artist Website',
    description: 'An artist website built around identity, photography and motion.',
    seo: { imageAlt: 'Scotty Grand artist website — RELAT' },

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
        // The site opens on the photograph, so the story does too. It is the
        // largest paint on a phone or tablet — fetched first there, on a
        // simulated slow 4G, it lands ~150–180ms sooner (5 runs, no overlap).
        // On a desktop it sits at the edge of the lazy-load margin and would
        // have been requested at load regardless.
        type: 'media',
        media: 'site-home',
        width: 'full',
        aspect: '16 / 9',
        priority: true,
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

  'secret-of-the-magical-mountains': {
    title: 'The Secret of the Magical Mountains',
    titleLines: ['The Secret of', 'the Magical Mountains'],
    category: 'Interactive Book Website',
    description: 'An illustrated digital journey extending a children’s story beyond the printed page.',
    seo: {
      title: 'The Secret of the Magical Mountains — Website | RELAT',
      description:
        'RELAT designed and developed an immersive website for Whistler Wander’s The Secret of the Magical Mountains, combining illustration, motion, responsive storytelling and direct reader contact.',
      imageAlt: 'The Secret of the Magical Mountains interactive website — RELAT',
    },

    // RELAT's own work — but not RELAT's artwork. The illustrations were made
    // for the book; the studio designed and built the digital experience around
    // them, and the "Let the illustrations lead" passage says exactly that.
    //
    // Factual only. No metric, no result, no testimonial: none is verified. The
    // printed QR code is confirmed project context but there is no image of it,
    // so it appears in words and nowhere else — no QR or book mockup.
    story: [
      {
        type: 'opening',
        statement: 'An illustrated story extended beyond the page.',
        intro:
          'Whistler Wander wanted to give The Secret of the Magical Mountains a digital world of its own — one that could carry the atmosphere of the book beyond the printed page and invite readers deeper into the story.',
      },
      {
        // The opening itself, caught mid-transition.
        type: 'media',
        media: 'hero-mid-zoom',
        width: 'wide',
        edge: true,
        caption: 'Opening transition',
      },
      {
        type: 'passage',
        label: 'Context',
        heading: 'The book was already the experience. The website had to become part of it.',
        body: [
          'The Secret of the Magical Mountains is a children’s story shaped by adventure, imagination and the landscape around Whistler.',
          'Rather than presenting the book through a conventional product page, the website was conceived as an extension of that world — using illustration, pacing and movement to let the story unfold through the screen.',
        ],
      },
      {
        type: 'passage',
        variant: 'display',
        heading: 'Let the illustrations lead.',
        body: [
          'The artwork already carried the character of the story. RELAT built the digital experience around it, giving the illustrations space to lead while typography, motion and interface remained deliberately quiet.',
          'Full-screen scenes, restrained typography and carefully timed transitions give each illustration room to become a moment rather than simply an image placed on a page.',
        ],
      },
      {
        type: 'media',
        media: 'art-journey',
        width: 'wide',
        aspect: '2 / 1',
        caption: 'Original illustration supplied for the book',
      },
      {
        // The night scenes read best on a night ground, so the story's middle
        // is the page's one dark chapter. The screenshots carry their own
        // typography; nothing here repeats it.
        type: 'chapter',
        blocks: [
          {
            type: 'passage',
            heading: 'A story you move through.',
            body: [
              'Scrolling became part of the narrative. Scenes appear in sequence, with movement used to create rhythm and anticipation rather than decorate the interface.',
              'The experience moves from the opening invitation through the journey, the guardian, the Echo Stone and the return of joy before introducing the author and the ways to find the book.',
            ],
          },
          {
            type: 'stagger',
            media: ['guardian', 'echo-stone'],
            placement: [
              [1, 9],
              [6, 7],
            ],
          },
        ],
      },
      {
        type: 'passage',
        heading: 'Motion should disappear into the story.',
        body: [
          'The animation system was built around the pacing of the illustrations, with motion reduced or removed for visitors who prefer a quieter experience.',
          'The objective was never to make the website feel animated. It was to make moving through it feel natural.',
        ],
      },
      {
        // Something the illustration alone cannot show: the handoff.
        type: 'media',
        media: 'book-handoff',
        width: 'wide',
        edge: true,
        caption: 'From story to book',
      },
      {
        type: 'handsets',
        heading: 'The mountains had to fit in a hand.',
        body: [
          'The experience was composed independently for smaller screens rather than treated as a reduced desktop layout.',
          'Typography, image framing, spacing and scroll pacing were adjusted so the illustrated journey could keep its atmosphere on a phone.',
          'A printed QR code in the physical book connects readers directly to the digital experience, making mobile a primary entry point rather than a secondary adaptation.',
        ],
        screens: ['mobile-guardian', 'mobile-where-to-buy'],
        caption: 'Responsive storytelling — Guardian and Where to Buy',
      },
      {
        type: 'passage',
        heading: 'The journey eventually has to lead somewhere.',
        body: [
          'After the story unfolds, the site shifts from immersion to information: introducing Eva Velasco, guiding readers into the Where to Buy section and giving interested readers a direct way to request a copy.',
          'The transition keeps the practical parts of the website connected to the same visual language rather than breaking into a separate storefront experience.',
        ],
      },
      {
        type: 'media',
        media: 'meet-eva',
        mobile: 'meet-eva-mobile',
        width: 'wide',
        edge: true,
        caption: 'Meet Eva Velasco',
      },
      {
        type: 'passage',
        heading: 'A simple path to the book.',
        body: [
          'The final experience gives readers a direct route to ask for a copy, contact Whistler Wander and continue the relationship beyond the story.',
          'The enquiry flow was tested end to end before launch, including form delivery and mobile interaction.',
        ],
      },
      {
        type: 'stagger',
        media: ['where-to-buy', 'want-a-copy'],
        edge: true,
        // Where to Buy is already shown on a phone above; here it needs room.
        desktopOnly: ['where-to-buy'],
        caption: 'Where to Buy and Want a Copy',
        placement: [
          [1, 8],
          [5, 8],
        ],
      },
      {
        type: 'passage',
        variant: 'display',
        heading: 'From printed page to digital place.',
        body: [
          'The finished website gives The Secret of the Magical Mountains a home beyond the book itself: part story, part introduction and part connection point between Whistler Wander and its readers.',
          'The physical and digital experiences meet through the printed QR code, while the site remains accessible as a standalone journey for anyone discovering the story online.',
        ],
      },
    ],
  },

  'gecko-surf-house': {
    title: 'Gecko Surf House',
    category: 'Hospitality Website',
    description: 'A hostel website that has to sell rooms, not just show them.',
    seo: {
      title: 'Gecko Surf House — Hospitality Web Design | RELAT',
      description:
        'Hospitality web design case study for Gecko Surf House in Santa Teresa, Costa Rica, covering room discovery, responsive UX and Lodgify booking integration.',
      imageAlt: 'Gecko Surf House hospitality website — RELAT',
    },

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
        type: 'passage',
        label: 'Context',
        heading: 'A hostel website has more than one job to do.',
        body: [
          'Gecko Surf House is a surf hostel in Santa Teresa, Costa Rica. The website needed to communicate the character of the property while helping travelers understand the rooms, check availability and move naturally toward a reservation.',
          'The project focused on connecting those decisions rather than treating the website and booking system as separate experiences.',
        ],
      },
      {
        // Replaces 'A hostel site has a job to do.', which sat too close to the
        // Context heading directly above it.
        type: 'statement',
        text: 'The job starts at the homepage.',
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
        type: 'passage',
        heading: 'The practical part had to feel like part of the brand.',
        body: [
          'Travelers needed to understand the difference between rooms quickly, without losing the atmosphere that made the property distinctive.',
          'That meant treating room information, photography, availability and booking actions as part of the same design system rather than adding them after the visual direction was finished.',
        ],
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
        // Describes an integration with an existing platform — nothing here
        // claims the studio built, owns or controls it, or any result from it.
        type: 'passage',
        body: [
          'Lodgify handles the underlying availability and reservation flow while the website keeps room discovery, dates and booking actions clear within the guest journey.',
          'The integration lets the existing booking infrastructure do its job without making the website feel like a separate marketing layer.',
        ],
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
      {
        type: 'passage',
        heading: 'One path from first look to booking.',
        body: [
          'The finished experience brings property discovery, room selection, live availability and reservation into one responsive journey.',
          'Instead of ending at a generic “Book now” button, the website helps the guest make the decisions that lead up to it.',
        ],
      },
    ],
  },

  bolaca: {
    title: 'Bolaca',
    category: 'E-commerce',
    description: 'A Chilean shop for children’s games and books, built around browsing and buying.',
    seo: { imageAlt: 'Bolaca e-commerce website — RELAT' },

    // Factual only. Captured directly from the current live storefront
    // (bolaca.cl): a catalogue of games, books and didactic cards, filtered
    // by brand, category, recommended age and price, with stock state shown
    // on both the catalogue and the product page, two ways to buy, and a
    // real multi-step checkout with Chile-wide delivery. No outcome, no
    // metric, no quote. Roles and year are unconfirmed and stated nowhere.
    //
    // Where Scotty is identity and Gecko is booking, Bolaca is the full
    // commerce path: discovery -> filter -> product -> cart -> checkout. The
    // products are the protagonist, so the sequence alternates full
    // interface views with a tighter crop of the filter panel rather than
    // running a column of full-page screenshots.
    story: [
      {
        type: 'statement',
        text: 'A shop for children’s games and books.',
      },
      {
        // The largest paint at tablet width, where fetching it first lands it
        // ~380ms sooner on a simulated slow 4G (5 runs); on a phone the largest
        // paint is text, and this changes nothing.
        type: 'media',
        media: 'storefront',
        width: 'full',
        aspect: '16 / 9',
        priority: true,
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
        caption: 'Catalogue, filtered by brand and category',
      },
      {
        // The clearest piece of thinking in the project: children's products
        // filtered by recommended age, not only by category and price.
        type: 'media',
        media: 'filters',
        width: 'inset',
        aspect: '3 / 4',
        caption: 'Brand, category, recommended age, price',
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
        caption: 'Product, price, age and two ways to buy',
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
      },
      {
        type: 'statement',
        text: 'And through to checkout.',
      },
      {
        type: 'media',
        media: 'checkout',
        width: 'wide',
        aspect: '8 / 5',
        caption: 'A three-step checkout with delivery across Chile',
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
