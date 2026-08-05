import { Link } from 'react-router';
import { cn } from '../../lib/cn.js';

/**
 * Buttons are rectangles. Radius stays at 0 by default across the site —
 * see docs/E-brand-constitution.md §34 on rounded-rectangle soup.
 *
 * Three variants, and there should not be a fourth:
 *   primary   — the one action on a screen that matters
 *   secondary — an outlined alternative
 *   ghost     — navigation-weight, no chrome
 */
const VARIANTS = {
  primary: `
    bg-fg text-bg
    hover:bg-accent hover:text-accent-contrast
    active:translate-y-px
  `,
  secondary: `
    border border-control-line text-fg
    hover:border-fg hover:bg-fg hover:text-bg
    active:translate-y-px
  `,
  ghost: `
    text-fg-muted
    hover:text-fg
  `,
};

const SIZES = {
  base: 'px-lg py-xs text-body-sm',
  lg: 'px-xl py-sm text-body',
};

export function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'base',
  className,
  children,
  ...rest
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2xs',
    'font-mono uppercase tracking-label text-label',
    'rounded-none',
    'transition-[background-color,color,border-color,transform] duration-[--duration-base] ease-out-quint',
    'disabled:pointer-events-none disabled:opacity-40',
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const Tag = as ?? 'button';
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
