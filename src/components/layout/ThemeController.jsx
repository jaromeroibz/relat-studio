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
 * at a time: the one crossing the horizontal centre line.
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

    const observer = new IntersectionObserver(
      (entries) => {
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
