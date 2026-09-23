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

    // RETURNED. The live storefront has real, current capture material — see
    // media below — so the index can send visitors into a complete story
    // again.
    listed: true,

    // Every slot is a capture of the live storefront (bolaca.cl), taken
    // directly from the current site — no stock imagery, no mockups.
    media: {
      cover: {
        src: '/projects/bolaca/storefront.jpg',
        alt: 'The Bolaca storefront: a carousel of board games and books over a "Juegos de mesa" banner, with featured products beneath',
        width: 1728,
        height: 900,
      },
      storefront: {
        src: '/projects/bolaca/storefront.jpg',
        alt: 'The Bolaca storefront: a carousel of board games and books over a "Juegos de mesa" banner, with featured products beneath',
        width: 1728,
        height: 900,
      },
      catalogue: {
        src: '/projects/bolaca/catalogue.jpg',
        alt: 'The Bolaca catalogue filtered to one brand and category, showing 19 results with stock and price on each card',
        width: 1728,
        height: 820,
      },
      filters: {
        src: '/projects/bolaca/filters.jpg',
        alt: 'The Bolaca filter panel: brand, category, recommended age and price, with two filters active',
        width: 279,
        height: 642,
      },
      'product-detail': {
        src: '/projects/bolaca/product-detail.jpg',
        alt: 'A Bolaca product page with gallery, price, recommended age, quantity and two purchase actions',
        width: 1728,
        height: 920,
      },
      cart: {
        src: '/projects/bolaca/cart.jpg',
        alt: 'The Bolaca cart holding two different products with quantities, subtotal and total',
        width: 1728,
        height: 750,
      },
      checkout: {
        src: '/projects/bolaca/checkout.jpg',
        alt: 'Bolaca checkout, delivery step: a three-step progress indicator, a Chile-wide address form, and the order summary carried over from the cart',
        width: 1728,
        height: 900,
      },
      'mobile-home': {
        src: '/projects/bolaca/mobile-home.jpg',
        alt: 'The Bolaca storefront on mobile',
        width: 780,
        height: 1688,
      },
      'mobile-catalogue': {
        src: '/projects/bolaca/mobile-catalogue.jpg',
        alt: 'The Bolaca catalogue on mobile, with a collapsed filter control',
        width: 780,
        height: 1688,
      },
      'mobile-product': {
        src: '/projects/bolaca/mobile-product.jpg',
        alt: 'A Bolaca product page on mobile',
        width: 780,
        height: 1688,
      },
    },
  },
];

/** @param {string} slug */
export function getProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

/**
 * Projects for the index, in authored order.
 *
 * `listed: false` withholds a project from the index and from the handoff
 * chain without removing it from the portfolio — used while a project's real
 * media is still being produced.
 */
export function getFeaturedProjects(limit) {
  const featured = projects.filter(
    (project) => project.featured && project.listed !== false
  );
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
