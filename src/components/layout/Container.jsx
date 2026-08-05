import { cn } from '../../lib/cn.js';

const WIDTHS = {
  full: 'max-w-none',
  wide: 'max-w-wide',
  default: 'max-w-default',
  narrow: 'max-w-narrow',
  text: 'max-w-text',
};

/**
 * Horizontal measure and gutters.
 *
 * Four widths, each with a job:
 *   wide     — full-bleed compositions and image grids
 *   default  — the standard page measure
 *   narrow   — editorial passages, case-study bodies
 *   text     — running prose, held to a readable line length
 *
 * @param {object} props
 * @param {keyof typeof WIDTHS} [props.width='default']
 * @param {boolean} [props.gutter=true]
 */
export function Container({
  as: Tag = 'div',
  width = 'default',
  gutter = true,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn('mx-auto w-full', WIDTHS[width], gutter && 'px-gutter', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
