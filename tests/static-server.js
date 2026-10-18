import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Serves the production build (`build/client`) the way Netlify does: every
 * route is a prerendered `<path>/index.html`, anything else is the real 404
 * page. Used only by the end-to-end tests, so they exercise the shipped HTML
 * and chunks rather than the dev server.
 */
const ROOT = fileURLToPath(new URL('../build/client/', import.meta.url));
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

async function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, clean);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    return { file, status: 200 };
  } catch {
    return { file: join(ROOT, '404.html'), status: 404 };
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  const { file, status } = await resolve(pathname);
  try {
    const body = await readFile(file);
    res.writeHead(status, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => console.log(`static server on http://localhost:${PORT}`));
