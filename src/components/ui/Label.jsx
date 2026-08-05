import { cn } from '../../lib/cn.js';

/**
 * Small monospaced label — section numbers, categories, metadata.
 *
 * This is where the "technical" half of the brand shows up. It is the only
 * place the mono face appears, and it is what keeps oversized display type
 * from reading as fashion.
 */
export function Label({ as: Tag = 'span', className, children, ...rest }) {
  return (
    <Tag
      className={cn('font-mono text-label uppercase text-fg-muted', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
