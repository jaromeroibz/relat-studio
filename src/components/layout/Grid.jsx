import { cn } from '../../lib/cn.js';

/**
 * The editorial grid: 4 columns on mobile, 8 on tablet, 12 on desktop.
 *
 * Column counts change at the same breakpoints as the three compositions, so
 * a layout decision made here is a layout decision about the composition —
 * not an arbitrary reflow.
 */
export function Grid({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        'grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
