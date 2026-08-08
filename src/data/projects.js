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
        width: 2400,
        height: 1284,
      },
      portrait: {
        src: '/projects/scotty-grand/portrait.jpg',
        alt: 'Black and white portrait of Scotty Grand in a white shirt and dark sunglasses, arms folded, against a sunlit wall',
        width: 1800,
        height: 2249,
      },
      'site-home': {
        src: '/projects/scotty-grand/site-home.jpg',
        alt: 'The Scotty Grand website opening on a full-screen black and white portrait beneath the wordmark',
        width: 2400,
        height: 1284,
      },
      'site-detail': {
        src: '/projects/scotty-grand/site-detail.jpg',
        alt: 'A section of the Scotty Grand site pairing the headline "Warm Up Your Voice Like a Pro" with a portrait',
        width: 2400,
        height: 1277,
      },
      // Available, deliberately unused. No story block references it yet.
      about: {
        src: '/projects/scotty-grand/about.jpg',
        alt: 'The About page of the Scotty Grand site, pairing a portrait with a biography',
        width: 2400,
        height: 1280,
      },
    },
  },
  {
    slug: 'gecko-surf-house',
    client: 'Gecko Surf House',
    // Unconfirmed. Stays null and renders as nothing rather than a guess.
    year: null,
    roles: ['Web Design', 'Frontend Development', 'Booking Integration'],
    status: 'completed',
    // Completed before RELAT existed. Confirm before changing.
    attribution: 'prior-work',
    url: 'https://www.geckosurfhouse.com',
    emphasis: 'standard',
    atmosphere: 'natural',
    featured: true,
    // Gecko is a digital-experience story: the interface is the hero material,
    // not the property. Every slot below is a capture of the live site.
    //
    // The one photograph left in play is the index cover, and only because the
    // index needs an image today. It should be replaced by `site-home` as soon
    // as that capture exists.
    media: {
      // The index shows the site, not the property.
      cover: {
        src: '/projects/gecko-surf-house/site-home.jpg',
        alt: 'The Gecko Surf House homepage: the studio wordmark and "Welcome to Gecko Surf House" over an aerial image of breaking surf',
        width: 2400,
        height: 1350,
      },
      'site-home': {
        src: '/projects/gecko-surf-house/site-home.jpg',
        alt: 'The Gecko Surf House homepage: the studio wordmark and "Welcome to Gecko Surf House" over an aerial image of breaking surf',
        width: 2400,
        height: 1350,
      },
      'ui-type': {
        src: '/projects/gecko-surf-house/ui-type.jpg',
        alt: 'The site footer on deep forest green, reading "Follow the swell." above an oversized ghosted GECKO wordmark',
        width: 2400,
        height: 1001,
      },
      'rooms-index': {
        src: '/projects/gecko-surf-house/rooms-index.jpg',
        alt: 'The rooms page headed "Find your perfect room." with a date and guest search above two room cards',
        width: 2400,
        height: 1505,
      },
      'booking-calendar': {
        src: '/projects/gecko-surf-house/booking-calendar.jpg',
        alt: 'A room detail page for La Lora with photography, amenities and a date selection panel',
        width: 2400,
        height: 1505,
      },
      // An oversized crop of the same page — the booking panel on its own.
      'booking-summary': {
        src: '/projects/gecko-surf-house/booking-summary.jpg',
        alt: 'The booking panel in close-up: check-in and check-out dates, guest count, search, and a pricing and availability summary with a book now action',
        width: 1200,
        height: 1176,
      },
      // Three separate screens rather than one composed image, so the story
      // can stack them on small viewports instead of shrinking them.
      'mobile-home': {
        src: '/projects/gecko-surf-house/mobile-home.jpg',
        alt: 'The Gecko Surf House homepage on mobile',
        width: 900,
        height: 1950,
      },
      'mobile-rooms': {
        src: '/projects/gecko-surf-house/mobile-rooms.jpg',
        alt: 'A room card on mobile showing photography, amenities and a book action',
        width: 900,
        height: 1955,
      },
      'mobile-booking': {
        src: '/projects/gecko-surf-house/mobile-booking.jpg',
        alt: 'The booking panel on mobile with dates, search, pricing and a book now action',
        width: 900,
        height: 1947,
      },
    },
  },
  {
    slug: 'bolaca',
    client: 'Bolaca',
    // Unconfirmed. Both stay null and render as nothing rather than a guess.
    year: null,
    roles: [],
    status: 'completed',
    attribution: 'prior-work',
    url: 'https://www.bolaca.cl',
    emphasis: 'standard',
    atmosphere: 'precise',
    featured: true,

    // Every slot is a capture of the live storefront. Pending: the browser
    // pane renders bolaca.cl at 572–800px, which is too small for editorial
    // presentation, so nothing here is filled with a weak asset.
    media: {
      cover: null,
      storefront: null,
      catalogue: null,
      filters: null,
      'product-detail': null,
      'product-card': null,
      cart: null,
      'mobile-home': null,
      'mobile-catalogue': null,
      'mobile-product': null,
    },
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
