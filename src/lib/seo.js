import { getContent } from '../data/index.js';

/**
 * One place that builds a route's head.
 *
 * Every route gets a title, a description, a canonical URL and a complete
 * Open Graph / Twitter set from the same source, so a route cannot ship with
 * half of them. Keyword themes live in the copy the studio would write anyway
 * — search should never be audible (docs/E §29).
 *
 * i18n: `locale` flows through to og:locale and is ready for an hreflang set
 * when Spanish exists. No Spanish routes are declared yet.
 *
 * @param {object} options
 * @param {string} options.title       Page title, without the studio suffix.
 * @param {string} options.description
 * @param {string} options.path        Route path, e.g. '/work/scotty-grand'.
 * @param {'website'|'article'} [options.type]
 * @param {string} [options.image]     Absolute-from-root path to a share image.
 * @param {boolean} [options.noindex]
 */
export function buildMeta({
  title,
  description,
  path,
  type = 'website',
  image,
  noindex = false,
}) {
  const { site } = getContent();
  // Every prerendered non-root route ships as `<path>/index.html`, and
  // Netlify's static server 301s the extensionless request to the trailing-
  // slash form before it ever serves that file — the slash version is the
  // real, final 200 URL. A canonical pointing at the pre-redirect form is a
  // canonical pointing at a redirect, which crawlers ignore or penalize; this
  // must match the sitemap exactly for the same reason.
  const url = path === '/' ? `${site.url}/` : `${site.url}${path}/`;
  const fullTitle = path === '/' ? title : `${title} — ${site.name}`;
  const shareImage = `${site.url}${image ?? '/og.jpg'}`;

  const tags = [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },

    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: 'en' },
    { property: 'og:image', content: shareImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${site.name} — ${site.descriptor}` },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: shareImage },
  ];

  if (noindex) tags.push({ name: 'robots', content: 'noindex, nofollow' });

  return tags;
}

const FOUNDER_NAME = 'Javier Romero';

/**
 * The stable identifiers for RELAT and its founder. Each entity is described
 * in full once, on the homepage; every other block repeats only a minimal
 * node with the same `@id`, so crawlers resolve them all to one entity.
 */
function organizationId() {
  const { site } = getContent();
  return `${site.url}/#organization`;
}

function founderId() {
  const { site } = getContent();
  return `${site.url}/#founder`;
}

/**
 * Minimal RELAT node for other pages: same `@id`, just enough to read alone.
 * Typed `Organization` (the parent type of the homepage's ProfessionalService)
 * so these references are not read as separate local-business listings.
 */
function organizationNode() {
  const { site } = getContent();
  return {
    '@type': 'Organization',
    '@id': organizationId(),
    name: site.name,
    url: `${site.url}/`,
  };
}

/** Minimal founder node for other pages: same `@id`, just enough to read alone. */
function founderNode() {
  return { '@type': 'Person', '@id': founderId(), name: FOUNDER_NAME };
}

/**
 * Structured data for the studio itself: the RELAT entity and the website
 * that publishes it, as one graph.
 *
 * ProfessionalService rather than Organization: it carries the location, which
 * is the part that matters for "digital studio Santa Teresa" and "web design
 * Costa Rica". Only claims that are true and already on the page.
 */
export function studioJsonLd() {
  const { site } = getContent();
  const home = `${site.url}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': organizationId(),
        name: site.name,
        alternateName: site.alternateName,
        description: site.meta.description,
        url: home,
        email: site.contact.email,
        telephone: site.contact.telephone,
        logo: {
          '@type': 'ImageObject',
          url: `${site.url}${site.logo}`,
          width: 1024,
          height: 1024,
        },
        founder: { '@id': founderId() },
        sameAs: site.sameAs,
        // Locality only. No street address is published.
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Santa Teresa',
          addressRegion: 'Puntarenas',
          addressCountry: 'CR',
        },
        areaServed: [
          { '@type': 'Country', name: 'Costa Rica' },
          { '@type': 'Place', name: 'Worldwide' },
        ],
        // English only, matching the site as it actually exists today — see
        // CLAUDE.md's i18n note for when a Spanish route is real.
        knowsLanguage: 'en',
      },
      // A real person, named — but RELAT stays the entity every other field
      // here describes. Name only: nothing about them beyond what the site
      // already says.
      founderNode(),
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.name,
        alternateName: site.alternateName,
        url: home,
        inLanguage: 'en',
        publisher: { '@id': organizationId() },
      },
    ],
  };
}

/**
 * A dedicated service page (e.g. `/hospitality-web-design/`), described as a
 * `Service` RELAT provides — distinct from the homepage's `ProfessionalService`
 * (the business itself) and a project's `CreativeWork` (finished work).
 * `provider` repeats only a minimal node with the canonical RELAT `@id`
 * rather than the homepage's full entity block, so the two never drift apart.
 *
 * No `aggregateRating`, `review`, `offers` or `FAQPage` — none exist, and
 * none should be implied until they genuinely do.
 */
export function serviceJsonLd({ name, description, path }) {
  const { site } = getContent();

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    url: `${site.url}${path}/`,
    provider: organizationNode(),
    areaServed: [
      { '@type': 'Country', name: 'Costa Rica' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
  };
}

/**
 * A project page, described as creative work.
 *
 * The creator follows the project's `attribution`, the same field the visible
 * page reads: RELAT's own work credits the studio; prior work credits the
 * founder, as the page's attribution note does. Anything else names no creator.
 */
export function projectJsonLd(project, copy) {
  const { site } = getContent();
  const creator =
    project.attribution === 'relat'
      ? organizationNode()
      : project.attribution === 'prior-work'
        ? founderNode()
        : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: copy.title,
    description: copy.description,
    url: `${site.url}/work/${project.slug}/`,
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(creator ? { creator } : {}),
    about: copy.category,
  };
}
