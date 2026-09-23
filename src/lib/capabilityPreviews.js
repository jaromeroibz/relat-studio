import { getProject } from '../data/projects.js';

/**
 * Capabilities' fixed media panel — the data.
 *
 * Two real images per capability, shown one at a time at their own natural
 * aspect ratio (see CapabilityPreview.jsx) — never stretched into a fixed
 * frame. Most are focused fragments of a real interface, cropped tightly to
 * the component that demonstrates the capability (`public/capabilities/`):
 * the point of each is to be understood at a glance.
 *
 * Per image, beyond `src/alt/width/height`:
 *   radius   The corner radius of the *source component*, in the image's own
 *            pixels, so the preview keeps the shape it was cropped from.
 *   frame    Whether the image gets a hairline border. Only for images that
 *            are themselves white/near-white and would otherwise dissolve into
 *            the white Capabilities ground.
 *
 * Web Design keeps the two Scotty Grand captures from RELAT's own Work
 * section, uncropped — that capability is about art direction, which a
 * component crop would lose. Growth's two Google Analytics captures
 * (Whistler Wander, a real property unrelated to RELAT's own case studies)
 * are described inline rather than through `getProject`: there is no
 * `whistler-wander` entry in `src/data/projects.js` and there should not be
 * one — a project entry would risk the asset later being surfaced as a case
 * study.
 */
const SOURCE = {
  'strategy-ux': [
    // Bolaca: active filters, the filter panel and a result side by side —
    // discovery, filtering and information architecture in one glance.
    {
      asset: {
        src: '/capabilities/strategy-ux-bolaca-filters.webp',
        alt: 'Bolaca’s product listing: active brand filters above a filter panel with brand, category and age options, beside a product card with its price and purchase actions',
        width: 1230,
        height: 1036,
      },
    },
    // Gecko Surf House: the package cards — clear organisation of options.
    {
      asset: {
        src: '/capabilities/strategy-ux-gecko-packages.webp',
        alt: 'Two surf package cards from Gecko Surf House, one green and one orange, each with duration, price, inclusions and a booking button',
        width: 1808,
        height: 1174,
        radius: 0,
      },
    },
  ],
  'web-design': [
    // The two Scotty Grand captures already used in RELAT's own Work
    // section (src/data/en/projects.js) — art direction, not a new pick.
    { project: 'scotty-grand', key: 'site-home', frame: true },
    { project: 'scotty-grand', key: 'site-detail', frame: true },
  ],
  development: [
    // Gecko Surf House: date selection, guests, search, then pricing and
    // availability — a working booking interaction, not a mockup.
    {
      asset: {
        src: '/capabilities/development-gecko-booking.webp',
        alt: 'Gecko Surf House’s booking widget: check-in and check-out dates, guest counter and a search button, above a pricing and availability card with a Book Now button and a total',
        width: 854,
        height: 978,
        radius: 28,
      },
    },
    // Gecko Surf House: the booking call to action.
    {
      asset: {
        src: '/capabilities/development-gecko-cta.webp',
        alt: 'A booking call-to-action card from Gecko Surf House reading “Rooms fill fast. Don’t wait.” with real-time availability and a Book Your Room button',
        width: 720,
        height: 702,
        radius: 60,
        frame: true,
      },
    },
  ],
  'commerce-integrations': [
    // Bolaca: the cart — item, quantity controls, price.
    {
      asset: {
        src: '/capabilities/commerce-bolaca-cart.webp',
        alt: 'Bolaca’s cart: two products with quantity controls, unit prices, line totals and remove links',
        width: 1516,
        height: 880,
      },
    },
    // Bolaca: the payment step, with the card form.
    {
      asset: {
        src: '/capabilities/commerce-bolaca-checkout.webp',
        alt: 'Bolaca’s checkout payment method: card or Mercado Pago, with a card number, expiry, security code, name and document form and a Pay button',
        width: 1428,
        height: 1449,
        radius: 30,
      },
    },
  ],
  'growth-optimization': [
    {
      asset: {
        src: '/projects/whistler-wander/analytics-users.jpg',
        alt: 'A Google Analytics report for Whistler Wander showing active users and event counts over the last 7 days against the previous period',
        width: 1252,
        height: 802,
        frame: true,
      },
    },
    {
      asset: {
        src: '/projects/whistler-wander/analytics-countries.jpg',
        alt: 'A Google Analytics report for Whistler Wander showing active users by country on a world map, led by Singapore and Mexico',
        width: 1248,
        height: 798,
        frame: true,
      },
    },
  ],
};

function resolve(entry) {
  if (entry.asset) return entry.asset;
  const media = getProject(entry.project)?.media?.[entry.key];
  return media
    ? { src: media.src, alt: media.alt, width: media.width, height: media.height, frame: entry.frame }
    : null;
}

/**
 * @param {string} id
 * @returns {{src:string, alt:string, width:number, height:number, radius?:number, frame?:boolean}[]} Zero,
 *   one or (normally) two images, in a fixed, stable order.
 */
export function getCapabilityImages(id) {
  return (SOURCE[id] ?? []).map(resolve).filter(Boolean);
}

/**
 * Every capability's first (default) image, for warming the cache once —
 * see useCapabilityMedia.js. The second image is deliberately excluded: it
 * only ever loads once a capability is actually cycled to.
 */
export function getDefaultCapabilityPreviewSrcs(ids) {
  return ids.map((id) => getCapabilityImages(id)[0]?.src).filter(Boolean);
}
