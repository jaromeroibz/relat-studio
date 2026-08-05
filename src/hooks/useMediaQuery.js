import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a media query.
 *
 * Uses `useSyncExternalStore` rather than state-in-an-effect: the browser is
 * the store, so React reads it directly. That avoids a cascading render on
 * mount and gives prerendering an explicit server snapshot instead of a guess.
 *
 * @param {string} query
 * @param {boolean} [serverValue=false] What the prerendered HTML assumes.
 * @returns {boolean}
 */
export function useMediaQuery(query, serverValue = false) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
