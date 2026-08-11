/**
 * RELAT — build configuration.
 *
 * The site is fully static: no server runtime, no data loading at request time.
 * `ssr: false` + `prerender` renders every route to real HTML at build time, so
 * search engines and social crawlers receive complete markup, and the client
 * hydrates into the full animated experience afterwards.
 *
 * See docs/E-brand-constitution.md §29 (SEO) for why this matters.
 */

import { writeFile } from 'node:fs/promises';

const SITE_URL = 'https://relat.studio';

/**
 * Writes the sitemap during the build.
 *
 * Prerendering runs *after* public/ has been copied into build/client, so
 * writing only to public/ would ship yesterday's sitemap. It goes to both:
 * build/client for the deploy, public/ so the dev server serves the same file.
 */
async function writeSitemap(paths) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map(
      (path) =>
        `  <url>\n    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  for (const target of ['./public/sitemap.xml', './build/client/sitemap.xml']) {
    try {
      await writeFile(new URL(target, import.meta.url), xml);
    } catch {
      // build/client does not exist during `dev`. Not an error.
    }
  }
}

/** @type {import('@react-router/dev/config').Config} */
export default {
  appDirectory: 'src',
  ssr: false,

  // Every public route is listed explicitly. Project routes are appended from
  // the projects dataset so adding real work never requires touching config.
  async prerender() {
    // Only projects with a written story get a page. The rest appear in the
    // index and do not link anywhere, so no empty route is ever prerendered.
    const { projectCopy } = await import('./src/data/en/projects.js');
    const { projects } = await import('./src/data/projects.js');

    const stories = Object.entries(projectCopy)
      .filter(([, copy]) => Array.isArray(copy.story) && copy.story.length > 0)
      .map(([slug]) => slug);

    // The sitemap is written from the same list that builds the routes, so the
    // two cannot drift. Scaffolding routes and unlisted projects are excluded:
    // a sitemap is a set of pages worth indexing, not an inventory.
    const indexable = ['/', '/work'].concat(
      stories
        .filter((slug) => projects.find((p) => p.slug === slug)?.listed !== false)
        .map((slug) => `/work/${slug}`)
    );
    await writeSitemap(indexable);

    return ['/', '/work', '/system', '/type', ...stories.map((s) => `/work/${s}`)];
  },
};
