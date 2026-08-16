import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Hero variant switch, for review.
 *
 * `?hero=film` puts the film-grain light field on the page; anything else
 * leaves the approved hero untouched. Applied as a data attribute on <html>
 * and resolved entirely in CSS, so the prerendered markup is identical either
 * way and there is no hydration mismatch to manage.
 *
 * Temporary. Delete this hook, its call in root.jsx and the losing block in
 * hero.css once a direction is chosen.
 */
export function useHeroVariant() {
  const { search } = useLocation();

  useEffect(() => {
    const variant = new URLSearchParams(search).get('hero');
    const root = document.documentElement;

    if (variant === 'film') root.dataset.heroVariant = 'film';
    else delete root.dataset.heroVariant;
  }, [search]);
}
