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

/** @type {import('@react-router/dev/config').Config} */
export default {
  appDirectory: 'src',
  ssr: false,

  // Every public route is listed explicitly. Project routes are appended from
  // the projects dataset so adding real work never requires touching config.
  async prerender() {
    const { projects } = await import('./src/data/projects.js');

    return [
      '/',
      '/system',
      '/type',
      ...projects.map((project) => `/work/${project.slug}`),
    ];
  },
};
