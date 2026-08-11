import { copyFile, access } from 'node:fs/promises';

/**
 * Gives the static build a real 404.
 *
 * Every route is prerendered to a file, so a request for a path that exists is
 * served directly. Anything else should return an actual 404 status, not the
 * homepage with a 200 — a soft 404 tells crawlers the page exists and quietly
 * pollutes the index.
 *
 * Netlify serves `404.html` from the publish root for unmatched paths. The SPA
 * fallback already contains the app shell, which client-routes to the
 * in-brand not-found page, so the visitor sees the right thing and the crawler
 * gets the right status.
 */
const root = new URL('../build/client/', import.meta.url);
const fallback = new URL('__spa-fallback.html', root);
const notFound = new URL('404.html', root);

try {
  await access(fallback);
  await copyFile(fallback, notFound);
  console.log('postbuild: 404.html written from the SPA fallback');
} catch {
  console.warn('postbuild: no SPA fallback found — 404.html not written');
  process.exitCode = 1;
}
