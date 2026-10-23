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
 * @property {string} [location]      Where the client is. Shown in the project facts.
 * @property {string} [industry]      The client's field. Shown in the project facts.
 * @property {string} [booking]       The booking platform the site connects to, if any.
 * @property {string} [experience]    The kind of experience that was built. Shown in the project facts.
 * @property {string} [yearLabel]     Label for `year` in the facts. Defaults to "Year"; "Launch" for shipped work.
 * @property {boolean} [omitStatus]   Leave the Completed / In progress fact out of the header.
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
 * @property {boolean} [featured]     In the /work index and the next-project chain.
 * @property {boolean} [showcase]     Set to `false` to keep a featured project out of the
 *   homepage and the service pages' Selected Work chapters, which run on
 *   `getSelectedProjects()`. Absent means it appears there too.
 *
 * @typedef {object} ProjectImage
 * @property {string} src
 * @property {string} alt             Describes the image, not the project.
 * @property {number} width           Required — protects CLS.
 * @property {number} height          Required — protects CLS.
 * @property {string} [srcSet]        Smaller renditions of the *same* image, for
 *   small or low-density screens. `width`/`height` describe the largest.
 */

/**
 * A `srcset` for a project's own folder under /projects/.
 * `srcSet('gecko-surf-house', ['site-home-1200.webp', 1200], ['site-home.jpg', 2400])`
 * — each pair is a file and its intrinsic pixel width. The file named in `src`
 * stays the fallback, the share image and what a crawler without `srcset`
 * support reads; the browser picks from this list by the slot's `sizes`.
 */
const srcSet = (dir, ...entries) =>
  entries.map(([file, width]) => `/projects/${dir}/${file} ${width}w`).join(', ');

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
        srcSet: srcSet('scotty-grand', ['site-home-1200.webp', 1200], ['site-home-2400.webp', 2400]),
        alt: 'The Scotty Grand website opening on a full-screen black and white portrait beneath the wordmark',
        width: 2400,
        height: 1284,
      },
      portrait: {
        src: '/projects/scotty-grand/portrait.jpg',
        srcSet: srcSet('scotty-grand', ['portrait-1200.webp', 1200], ['portrait-1800.webp', 1800]),
        alt: 'Black and white portrait of Scotty Grand in a white shirt and dark sunglasses, arms folded, against a sunlit wall',
        width: 1800,
        height: 2249,
      },
      'site-home': {
        src: '/projects/scotty-grand/site-home.jpg',
        srcSet: srcSet('scotty-grand', ['site-home-1200.webp', 1200], ['site-home-2400.webp', 2400]),
        alt: 'The Scotty Grand website opening on a full-screen black and white portrait beneath the wordmark',
        width: 2400,
        height: 1284,
      },
      'site-detail': {
        src: '/projects/scotty-grand/site-detail.jpg',
        srcSet: srcSet('scotty-grand', ['site-detail-1200.webp', 1200], ['site-detail-2400.webp', 2400]),
        alt: 'A section of the Scotty Grand site pairing the headline "Warm Up Your Voice Like a Pro" with a portrait',
        width: 2400,
        height: 1277,
      },
      // Available, deliberately unused. No story block references it yet.
      about: {
        src: '/projects/scotty-grand/about.jpg',
        srcSet: srcSet('scotty-grand', ['about-1200.webp', 1200], ['about-2400.webp', 2400]),
        alt: 'The About page of the Scotty Grand site, pairing a portrait with a biography',
        width: 2400,
        height: 1280,
      },
    },
  },
  {
    slug: 'secret-of-the-magical-mountains',
    client: 'Whistler Wander',
    location: 'Whistler, Canada',
    industry: 'Publishing / Children’s Book',
    experience: 'Immersive Book Website',
    year: 2026,
    yearLabel: 'Launch',
    roles: ['Web Design', 'Frontend Development', 'Interactive Storytelling'],
    status: 'completed',
    omitStatus: true,
    // RELAT's own work. The book's illustrations are not: RELAT designed and
    // built the digital experience around artwork that already existed, and
    // the story says so as part of its rationale.
    attribution: 'relat',
    url: 'https://secretmountains.whistlerwander.com/',
    emphasis: 'standard',
    atmosphere: 'natural',
    featured: true,
    // In /work and the handoff chain; not yet on the homepage or the service
    // pages. Remove this line to place it there.
    showcase: false,
    // Every slot is a capture of the live site, or artwork supplied with the
    // book. Nothing here is a mockup, and there is no photograph of the
    // printed book or its QR code — none was available.
    media: {
      // The opening frame, cropped to 16:9 for the index and for sharing.
      cover: {
        src: '/projects/secret-of-the-magical-mountains/cover.jpg',
        srcSet: srcSet('secret-of-the-magical-mountains', ['cover-1200.webp', 1200], ['cover-2400.webp', 2400]),
        alt: 'The Secret of the Magical Mountains website mid-way through its opening transition, the illustrated cover enlarging around a child skiing',
        width: 2400,
        height: 1350,
      },
      'hero-mid-zoom': {
        src: '/projects/secret-of-the-magical-mountains/hero-mid-zoom.webp',
        srcSet: srcSet('secret-of-the-magical-mountains', ['hero-mid-zoom-1200.webp', 1200], ['hero-mid-zoom.webp', 2880]),
        alt: 'The Secret of the Magical Mountains website during the opening cover transition.',
        width: 2880,
        height: 2000,
      },
      'art-journey': {
        src: '/projects/secret-of-the-magical-mountains/art-journey.webp',
        srcSet: srcSet('secret-of-the-magical-mountains', ['art-journey-1200.webp', 1200], ['art-journey.webp', 2400]),
        alt: 'Illustration from the book showing a child skiing beneath sleepy mountain faces.',
        width: 2400,
        height: 1200,
      },
      guardian: {
        src: '/projects/secret-of-the-magical-mountains/guardian.webp',
        srcSet: srcSet('secret-of-the-magical-mountains', ['guardian-1200.webp', 1200], ['guardian.webp', 2880]),
        alt: 'Guardian scene on the Secret Mountains website: a child skiing beneath an owl above a sleeping bear.',
        width: 2880,
        height: 2000,
      },
      'echo-stone': {
        src: '/projects/secret-of-the-magical-mountains/echo-stone.webp',
        srcSet: srcSet('secret-of-the-magical-mountains', ['echo-stone-1200.webp', 1200], ['echo-stone.webp', 2880]),
        alt: 'Echo Stone scene on the Secret Mountains website: a child kneeling in the snow at night, holding a glowing stone before a mountain with a sleeping face.',
        width: 2880,
        height: 2000,
      },
      'book-handoff': {
        src: '/projects/secret-of-the-magical-mountains/book-handoff.webp',
        srcSet: srcSet('secret-of-the-magical-mountains', ['book-handoff-1200.webp', 1200], ['book-handoff.webp', 2880]),
        alt: 'The handoff from the story to the book section: the last illustration lifting away as the cover and title rise into place.',
        width: 2880,
        height: 2000,
      },
      'meet-eva': {
        src: '/projects/secret-of-the-magical-mountains/meet-eva.webp',
        alt: 'Meet Eva section introducing author Eva Velasco.',
        width: 2880,
        height: 2000,
      },
      // An honest crop of the same capture for phone widths: the interface
      // with the browser chrome, nav and WhatsApp button trimmed away.
      'meet-eva-mobile': {
        src: '/projects/secret-of-the-magical-mountains/meet-eva-mobile.webp',
        alt: 'Meet Eva section introducing author Eva Velasco.',
        width: 1400,
        height: 957,
      },
      'where-to-buy': {
        src: '/projects/secret-of-the-magical-mountains/where-to-buy.webp',
        alt: 'Where to Buy interface listing Whistler retailers.',
        width: 2880,
        height: 2000,
      },
      'want-a-copy': {
        src: '/projects/secret-of-the-magical-mountains/want-a-copy.webp',
        alt: 'Want a Copy enquiry form and WhatsApp contact option.',
        width: 2880,
        height: 2000,
      },
      'mobile-guardian': {
        src: '/projects/secret-of-the-magical-mountains/mobile-guardian.webp',
        alt: 'Mobile Guardian scene from the illustrated storytelling experience.',
        width: 1170,
        height: 2532,
      },
      'mobile-where-to-buy': {
        src: '/projects/secret-of-the-magical-mountains/mobile-where-to-buy.webp',
        alt: 'Where to Buy on mobile: the six Whistler retailers as a list of tappable rows.',
        width: 1170,
        height: 2532,
      },
    },
  },
  {
    slug: 'gecko-surf-house',
    client: 'Gecko Surf House',
    location: 'Santa Teresa, Costa Rica',
    industry: 'Hospitality / Surf Hostel',
    // Lodgify is the existing booking platform the site connects to; it is not
    // something the project built.
    booking: 'Lodgify',
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
        srcSet: srcSet('gecko-surf-house', ['site-home-1200.webp', 1200], ['site-home.jpg', 2400]),
        alt: 'The Gecko Surf House homepage: the studio wordmark and "Welcome to Gecko Surf House" over an aerial image of breaking surf',
        width: 2400,
        height: 1350,
      },
      'site-home': {
        src: '/projects/gecko-surf-house/site-home.jpg',
        srcSet: srcSet('gecko-surf-house', ['site-home-1200.webp', 1200], ['site-home.jpg', 2400]),
        alt: 'The Gecko Surf House homepage: the studio wordmark and "Welcome to Gecko Surf House" over an aerial image of breaking surf',
        width: 2400,
        height: 1350,
      },
      'ui-type': {
        src: '/projects/gecko-surf-house/ui-type.jpg',
        srcSet: srcSet('gecko-surf-house', ['ui-type-1200.webp', 1200], ['ui-type.jpg', 2400]),
        alt: 'The site footer on deep forest green, reading "Follow the swell." above an oversized ghosted GECKO wordmark',
        width: 2400,
        height: 1001,
      },
      'rooms-index': {
        src: '/projects/gecko-surf-house/rooms-index.jpg',
        srcSet: srcSet('gecko-surf-house', ['rooms-index-1200.webp', 1200], ['rooms-index-2400.webp', 2400]),
        alt: 'The rooms page headed "Find your perfect room." with a date and guest search above two room cards',
        width: 2400,
        height: 1505,
      },
      'booking-calendar': {
        src: '/projects/gecko-surf-house/booking-calendar.jpg',
        srcSet: srcSet('gecko-surf-house', ['booking-calendar-1200.webp', 1200], ['booking-calendar.jpg', 2400]),
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
        srcSet: srcSet('gecko-surf-house', ['mobile-home-900.webp', 900]),
        alt: 'The Gecko Surf House homepage on mobile: the gecko mark and “Welcome to Gecko Surf House” above a menu icon, with a WhatsApp button',
        width: 900,
        height: 1950,
      },
      'mobile-rooms': {
        src: '/projects/gecko-surf-house/mobile-rooms.jpg',
        srcSet: srcSet('gecko-surf-house', ['mobile-rooms-900.webp', 900]),
        alt: 'A room card on mobile showing photography, amenities and a book action',
        width: 900,
        height: 1955,
      },
      'mobile-booking': {
        src: '/projects/gecko-surf-house/mobile-booking.jpg',
        srcSet: srcSet('gecko-surf-house', ['mobile-booking-900.webp', 900]),
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
        srcSet: srcSet('bolaca', ['storefront-1200.webp', 1200], ['storefront.jpg', 1728]),
        alt: 'The Bolaca storefront: a carousel of board games and books over a "Juegos de mesa" banner, with featured products beneath',
        width: 1728,
        height: 900,
      },
      storefront: {
        src: '/projects/bolaca/storefront.jpg',
        srcSet: srcSet('bolaca', ['storefront-1200.webp', 1200], ['storefront.jpg', 1728]),
        alt: 'The Bolaca storefront: a carousel of board games and books over a "Juegos de mesa" banner, with featured products beneath',
        width: 1728,
        height: 900,
      },
      catalogue: {
        src: '/projects/bolaca/catalogue.jpg',
        srcSet: srcSet('bolaca', ['catalogue-1200.webp', 1200], ['catalogue.jpg', 1728]),
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
        srcSet: srcSet('bolaca', ['product-detail-1200.webp', 1200], ['product-detail.jpg', 1728]),
        alt: 'A Bolaca product page with gallery, price, recommended age, quantity and two purchase actions',
        width: 1728,
        height: 920,
      },
      cart: {
        src: '/projects/bolaca/cart.jpg',
        srcSet: srcSet('bolaca', ['cart-1200.webp', 1200], ['cart.jpg', 1728]),
        alt: 'The Bolaca cart holding two different products with quantities, subtotal and total',
        width: 1728,
        height: 750,
      },
      checkout: {
        src: '/projects/bolaca/checkout.jpg',
        srcSet: srcSet('bolaca', ['checkout-1200.webp', 1200], ['checkout.jpg', 1728]),
        alt: 'Bolaca checkout, delivery step: a three-step progress indicator, a Chile-wide address form, and the order summary carried over from the cart',
        width: 1728,
        height: 900,
      },
      'mobile-home': {
        src: '/projects/bolaca/mobile-home.jpg',
        srcSet: srcSet('bolaca', ['mobile-home-780.webp', 780]),
        alt: 'The Bolaca storefront on mobile: a “Juegos de mesa” banner above a Destacados section with a featured game and its price',
        width: 780,
        height: 1688,
      },
      'mobile-catalogue': {
        src: '/projects/bolaca/mobile-catalogue.jpg',
        srcSet: srcSet('bolaca', ['mobile-catalogue-780.webp', 780]),
        alt: 'The Bolaca catalogue on mobile, with a collapsed filter control',
        width: 780,
        height: 1688,
      },
      'mobile-product': {
        src: '/projects/bolaca/mobile-product.jpg',
        srcSet: srcSet('bolaca', ['mobile-product-780.webp', 780]),
        alt: 'A Bolaca product page on mobile: the game’s image gallery, name, brand, price and recommended age',
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
 * The projects the homepage and the service pages show: the featured set,
 * minus any with `showcase: false`. /work and the next-project chain use the
 * whole featured set.
 */
export function getSelectedProjects(limit) {
  const selected = getFeaturedProjects().filter((project) => project.showcase !== false);
  return limit ? selected.slice(0, limit) : selected;
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
