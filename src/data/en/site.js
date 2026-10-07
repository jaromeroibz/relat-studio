/**
 * Site-level copy and metadata — English.
 *
 * SEO phrasing is worked into language RELAT would actually use. See
 * docs/E-brand-constitution.md §29: search should never be audible in the copy.
 */

export const site = {
  name: 'RELAT',
  // Structured-data identity only — the visible wordmark stays as it is.
  alternateName: 'RELAT Studio',
  logo: '/brand/relat-google-profile-cream-1024.png',
  // The homepage's opening/persistent signature (Hero.jsx) — distinct from
  // `name`, which the nav's own, smaller wordmark uses.
  wordmark: 'RELAT STUDIO',
  descriptor: 'Digital Studio',
  domain: 'relat.studio',
  url: 'https://relat.studio',
  location: 'Santa Teresa, Costa Rica',

  meta: {
    title: 'RELAT — Digital Studio',
    titleTemplate: '%s — RELAT',
    description:
      'RELAT is a creative digital studio in Santa Teresa, Costa Rica. Strategy, design, development and creative technology for people who care how their brand exists online.',
  },

  contact: {
    label: 'Start a conversation',
    email: 'hello@relat.studio',
    // Structured data only — not rendered anywhere on the page.
    telephone: '+50662208866',
  },
};
