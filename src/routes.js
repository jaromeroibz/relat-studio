import { index, route } from '@react-router/dev/routes';

/**
 * Routes.
 *
 * Phase 1 ships the shell and the system page only. `/work`, `/services`,
 * `/about` and `/contact` are navigable in the design but are not built yet —
 * the catch-all below answers them in-brand rather than with a stack trace.
 * Each becomes a real route in its phase.
 */
export default [
  index('routes/home.jsx'),
  route('system', 'routes/system.jsx'),
  route('type', 'routes/type.jsx'),
  route('*', 'routes/not-found.jsx'),
];
