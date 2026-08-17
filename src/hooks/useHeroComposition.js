import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Compositions under comparison. Anything else leaves the approved hero alone. */
const COMPOSITIONS = ['a', 'b', 'c'];

/**
 * Hero composition switch, for review only.
 *
 * `?hero=a`, `?hero=b`, `?hero=c`. Applied as a data attribute on <html> and
 * resolved entirely in CSS — the markup is byte-identical for every
 * composition, which is what makes this a fair comparison and also means there
 * is no hydration mismatch to manage.
 *
 * Temporary. Delete this hook, its call in root.jsx, and
 * src/styles/hero-compositions.css once a direction is chosen.
 */
export function useHeroComposition() {
  const { search } = useLocation();

  useEffect(() => {
    const composition = new URLSearchParams(search).get('hero');
    const root = document.documentElement;

    if (COMPOSITIONS.includes(composition)) root.dataset.heroComp = composition;
    else delete root.dataset.heroComp;
  }, [search]);
}
