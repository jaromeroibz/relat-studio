import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';

// Imported directly rather than via `?url` + a `links` entry: React Router
// collects it into the built HTML either way, and letting Vite own the tag in
// dev avoids React and Vite both trying to manage the same <link> element.
import './styles/app.css';
import { MotionProvider } from './components/motion/MotionProvider.jsx';
import { SmoothScroll } from './components/motion/SmoothScroll.jsx';
import { ThemeController } from './components/layout/ThemeController.jsx';
import { Nav } from './components/navigation/Nav.jsx';
import { Footer } from './components/navigation/Footer.jsx';
import { SkipLink } from './components/navigation/SkipLink.jsx';
import { Container } from './components/layout/Container.jsx';
import { Section } from './components/layout/Section.jsx';
import { useHashScroll } from './hooks/useHashScroll.js';
import { getContent } from './data/index.js';


/**
 * Runs before first paint.
 *
 * Adds `js-motion` only when JavaScript is running and the visitor has not
 * asked for reduced motion. Every rule that hides content for an entrance is
 * scoped behind this class, which means content is visible by default — if
 * this script never runs, nothing is lost.
 *
 * It is inline and synchronous on purpose: deferring it would cause a flash of
 * content that then hides itself.
 */
const MOTION_BOOTSTRAP = `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion')}}catch(e){}})();`;

export function Layout({ children }) {
  return (
    // The pre-paint script adds `js-motion`, and ThemeController rewrites
    // `data-theme` as sections pass. Both are deliberate client-only mutations
    // of this element, so React is told not to reconcile its attributes.
    <html
      lang="en"
      data-theme="light"
      // Provisional until the Phase 2 typeface is approved. Changing this
      // value is the whole switch — see src/styles/typefaces.css.
      data-typeface="editorial"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f3efe9" />

        {/* The two faces on the critical path. Both are self-hosted latin
          * subsets, so there is no third-party connection to open first.
          * Candidate faces used at /type are deliberately not preloaded. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/instrument-serif.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/schibsted-grotesk.woff2"
          crossOrigin="anonymous"
        />
        {/* Mono carries the hero eyebrow and the navigation, both above the
          * fold, so it is on the critical path too. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/ibm-plex-mono.woff2"
          crossOrigin="anonymous"
        />

        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useHashScroll();

  return (
    <MotionProvider>
      <SmoothScroll />
      <ThemeController />
      <SkipLink />
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </MotionProvider>
  );
}

export function ErrorBoundary({ error }) {
  const { site } = getContent();

  const status = isRouteErrorResponse(error) ? error.status : null;
  const heading = status === 404 ? 'Nothing here' : 'Something went wrong';
  const body =
    status === 404
      ? 'That page does not exist, or has moved.'
      : 'An unexpected error occurred.';

  return (
    <Section theme="light" isolated space="lg" className="min-h-svh flex items-center">
      <Container width="narrow">
        <p className="font-mono text-label uppercase text-fg-muted">
          {status ?? 'Error'}
        </p>
        <h1 className="mt-md text-display-3">{heading}</h1>
        <p className="mt-md max-w-text text-body-lg text-fg-muted">{body}</p>
        <a
          href="/"
          className="link-underline mt-xl inline-block font-mono text-label uppercase"
        >
          Back to {site.name}
        </a>
      </Container>
    </Section>
  );
}
