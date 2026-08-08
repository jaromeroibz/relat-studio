import { index, route } from '@react-router/dev/routes';

/**
 * Routes.
 *
 * `/services`, `/about` and `/contact` are navigable in the design but are not
 * built yet — the catch-all below answers them in-brand rather than with a
 * stack trace. Each becomes a real route in its phase.
 *
 * `/work/:slug` arrives with the first real case study; see
 * getProjectsWithCaseStudy() in src/data/projects.js.
 */
export default [
  index('routes/home.jsx'),
  route('work', 'routes/work.jsx'),
  route('work/:slug', 'routes/work.$slug.jsx'),
  route('system', 'routes/system.jsx'),
  route('type', 'routes/type.jsx'),
  route('*', 'routes/not-found.jsx'),
];
