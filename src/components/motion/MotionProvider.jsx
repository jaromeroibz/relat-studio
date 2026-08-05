import { useMemo } from 'react';
import { MotionContext } from '../../lib/motion-context.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

/**
 * Resolves what kind of motion this visitor should get, once, at the top of
 * the tree.
 *
 * Every value starts in its most conservative state so prerendered HTML and
 * the first hydration pass assume no motion. Capability is granted after the
 * browser has been asked, never before.
 */
export function MotionProvider({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  const value = useMemo(() => {
    const allowMotion = !prefersReducedMotion;

    return {
      prefersReducedMotion,
      canHover,
      isDesktop,

      /** Reveals, theme transitions, section choreography. */
      allowMotion,
      /** Hover-driven interactions. Needs a real pointer. */
      allowHover: allowMotion && canHover,
      /** Parallax is desktop-only — it costs the most and reads the least on phones. */
      allowParallax: allowMotion && isDesktop,
      /** The custom cursor requires both a pointer and the room to matter. */
      allowCursor: allowMotion && canHover && isDesktop,
    };
  }, [prefersReducedMotion, canHover, isDesktop]);

  return <MotionContext value={value}>{children}</MotionContext>;
}
