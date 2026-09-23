import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Drives the document theme from whichever section owns the middle of the
 * viewport.
 *
 * Sections declare intent with `data-section-theme`; this sets `data-theme` on
 * <html>, which re-resolves every semantic colour token at once. The visible
 * cross-fade comes from CSS (see motion.css), not from JavaScript — nothing
 * here runs per frame.
 *
 * The `-50%` inset on both edges means exactly one section can be intersecting
 * at a time: the one crossing the horizontal centre line — *given* every
 * section is at least half the viewport tall. A page whose first section is
 * shorter than that (a compact page header on a tall phone, say) breaks that
 * assumption right at the top of the page: at scroll 0, the *second* section
 * can already span the centre line too, while the short first one — the
 * thing actually on screen — never gets to. The observer's very first
 * callback (fired once per target right after `observe()`, reporting the
 * state each already happens to be in, not a scroll-driven change) would
 * then apply that second section's theme immediately, overwriting the
 * fallback below with a theme that doesn't match anything visible yet.
 *
 * That first callback is only wrong in exactly that one case — a fresh load
 * at (or very near) the top — so that is the only case it is skipped in,
 * trusting the fallback instead. Anywhere else it fires (including a fresh
 * load whose scroll has been *restored* deep into the page, a real case
 * `useRouteScrollReset`/`<ScrollRestoration />` produce on Back/Forward) its
 * report is the correct one and is applied exactly as before — the fallback
 * below is only ever a guess for scroll 0, never a substitute for it.
 */
export function ThemeController({ defaultTheme = 'light' }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const sections = document.querySelectorAll('[data-section-theme]');

    if (sections.length === 0) {
      root.dataset.theme = defaultTheme;
      return;
    }

    const applyTheme = (theme) => {
      if (!theme || root.dataset.theme === theme) return;
      root.dataset.theme = theme;

      // Keep mobile browser chrome in step with the page.
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute(
          'content',
          getComputedStyle(root).getPropertyValue('--bg').trim()
        );
      }
    };

    // See the doc comment: only a fresh load at the very top can have the
    // observer's first report disagree with the correct theme, so that is
    // the only case this skips it.
    let firstBatch = window.scrollY < 4;

    const observer = new IntersectionObserver(
      (entries) => {
        if (firstBatch) {
          firstBatch = false;
          return;
        }
        for (const entry of entries) {
          if (entry.isIntersecting) applyTheme(entry.target.dataset.sectionTheme);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    for (const section of sections) observer.observe(section);

    // Above the first centre-crossing, nothing is intersecting yet — start
    // from the first section's theme rather than whatever was left behind.
    applyTheme(sections[0].dataset.sectionTheme ?? defaultTheme);

    return () => observer.disconnect();
  }, [pathname, defaultTheme]);

  return null;
}
