import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';

/**
 * Primary navigation.
 *
 * Sits *in* the composition rather than on top of it: no bar, no background,
 * no shadow. It inherits the current section's colour through the theme
 * tokens, so it changes with the page instead of floating above it.
 *
 * Below `md` the links move into a full overlay. That is a different
 * composition, not a hamburger stapled to the same one.
 */
export function Nav() {
  const { primaryNav, site } = getContent();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const triggerRef = useRef(null);

  // The menu remembers which route it was opened on, so navigating away closes
  // it as a matter of arithmetic rather than an effect chasing the location.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === pathname;
  const setOpen = (next) => setOpenAt(next ? pathname : null);

  // Escape closes and returns focus to the control that opened it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenAt(null);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      id="site-nav"
      className="fixed inset-x-0 top-0 z-[100] pointer-events-none"
      // The homepage's Hero intro (useHeroIntro.js) keeps the navbar out of
      // its opening frame and reveals it once the split resolves — see
      // hero.css. `undefined` on every other route, so the attribute (and
      // the CSS rule it drives) never applies there; this element persists
      // across route changes, so `isHome` re-evaluating on navigation is
      // what clears a stale `'true'` if the visitor leaves mid-intro.
      data-hero-intro-pending={isHome ? 'true' : undefined}
    >
      {/* The overlay is rendered first and the bar is positioned, so the
        * wordmark and the Close control always paint above the panel they
        * belong to. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          'pointer-events-auto md:hidden',
          'fixed inset-0 z-0 bg-bg text-fg',
          'flex flex-col justify-center gap-md px-gutter'
        )}
      >
        <nav aria-label="Primary" className="flex flex-col gap-2xs">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-display text-display-3 lowercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative z-10 flex items-baseline justify-between px-gutter py-md">
        <Link
          to="/"
          className="pointer-events-auto font-display text-heading-3 tracking-wide uppercase"
          aria-label={`${site.name} — home`}
        >
          {site.name}
        </Link>

        {/* Desktop / tablet */}
        <nav
          aria-label="Primary"
          className="pointer-events-auto hidden md:flex items-baseline gap-lg"
        >
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-underline font-mono text-label uppercase"
            >
              {/* The longer CTA form only at `lg`+, where the row has room for
                * it without crowding the wordmark or the other three items. */}
              {item.longLabel ? (
                <>
                  <span className="lg:hidden">{item.label}</span>
                  <span className="hidden lg:inline">{item.longLabel}</span>
                </>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="pointer-events-auto md:hidden font-mono text-label uppercase"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
