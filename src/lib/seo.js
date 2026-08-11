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
  // Trailing slash on the root only, matching the sitemap exactly — a
  // canonical that disagrees with the sitemap is a canonical that gets ignored.
  const url = path === '/' ? `${site.url}/` : `${site.url}${path}`;
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

/**
 * Structured data for the studio itself.
 *
 * ProfessionalService rather than Organization: it carries the location, which
 * is the part that matters for "digital studio Santa Teresa" and "web design
 * Costa Rica". Only claims that are true and already on the page.
 */
export function studioJsonLd() {
  const { site } = getContent();

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: site.meta.description,
    url: site.url,
    email: site.contact.email,
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
    knowsLanguage: ['en', 'es'],
  };
}

/** A project page, described as creative work. */
export function projectJsonLd(project, copy) {
  const { site } = getContent();

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: copy.title,
    description: copy.description,
    url: `${site.url}/work/${project.slug}`,
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    creator: { '@type': 'Organization', name: site.name, url: site.url },
    about: copy.category,
  };
}
