import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Directions under review. Anything else leaves the approved hero alone. */
const VARIANTS = ['film', 'arc', 'refract'];

/**
 * Hero variant switch, for review.
 *
 * `?hero=film` or `?hero=arc`. Applied as a data attribute on <html> and
 * resolved entirely in CSS, so the prerendered markup is identical for every
 * variant and there is no hydration mismatch to manage.
 *
 * Temporary. Delete this hook, its call in root.jsx and the losing blocks in
 * hero.css once a direction is chosen.
 */
export function useHeroVariant() {
  const { search } = useLocation();

  useEffect(() => {
    const variant = new URLSearchParams(search).get('hero');
    const root = document.documentElement;

    if (VARIANTS.includes(variant)) root.dataset.heroVariant = variant;
    else delete root.dataset.heroVariant;
  }, [search]);
}
