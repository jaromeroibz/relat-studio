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
import { useRouteScrollReset } from './hooks/useRouteScrollReset.js';
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

/**
 * Google Tag Manager — the site's single tracking container.
 *
 * GA4 and Microsoft Clarity both load *through* GTM; neither is installed
 * here directly, so there is exactly one place to change what tracks. This is
 * Google's standard container snippet, verbatim apart from the ID being a
 * constant.
 *
 * It lives in `Layout`, which React Router renders once per prerendered HTML
 * document and never again on client-side navigation — so the container
 * neither duplicates across routes nor re-injects when the visitor moves
 * between them. Custom events are pushed to `window.dataLayer` from
 * src/lib/analytics.js.
 */
const GTM_ID = 'GTM-W39VRDCV';
const GTM_BOOTSTRAP = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export function Layout({ children }) {
  return (
    // The pre-paint script adds `js-motion`, and ThemeController rewrites
    // `data-theme` as sections pass. Both are deliberate client-only mutations
    // of this element, so React is told not to reconcile its attributes.
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Tag Manager — as high in <head> as it can go, per Google's own
          * placement guidance, so it is not delayed behind anything else. */}
        <script dangerouslySetInnerHTML={{ __html: GTM_BOOTSTRAP }} />

        <meta name="theme-color" content="#f3efe9" />

        {/* The wordmark's own R, set in the site's display face. Not a second
          * logo language — the identity is the typography. */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/png" href="/icon-32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* The faces on the critical path, self-hosted latin subsets — no
          * third-party connection to open before text can render. */}
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
        {/* Tag Manager's no-JavaScript fallback — must be the first thing in
          * <body>. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Called first: its useLayoutEffect must land the route at the top before
  // useHashScroll's own (passive) effect reads Lenis's position to animate
  // from it. React commits layout effects in call order within one component,
  // and every layout effect across the tree — including this one and
  // <ScrollRestoration />'s — runs before any passive effect does, so this
  // ordering holds regardless of where either sits in the tree.
  useRouteScrollReset();
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
