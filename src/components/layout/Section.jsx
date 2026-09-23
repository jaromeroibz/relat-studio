import { cn } from '../../lib/cn.js';

const SPACE = {
  none: '',
  sm: 'py-section-sm',
  base: 'py-section',
  lg: 'py-section-lg',
};

/**
 * A composition band.
 *
 * `theme` declares which palette this part of the sequence belongs to. By
 * default the section only *announces* its theme and lets ThemeController
 * cross-fade the whole document — that continuity is what makes the page read
 * as one sequence rather than a stack of blocks.
 *
 * `isolated` opts out: the theme applies to this subtree alone and does not
 * touch the document. Used where several themes must coexist on one screen,
 * such as the system page.
 *
 * @param {object} props
 * @param {'light'|'dark'|'warm'} [props.theme]
 * @param {boolean} [props.isolated=false]
 * @param {keyof typeof SPACE} [props.space='base']
 */
export function Section({
  as: Tag = 'section',
  theme,
  isolated = false,
  space = 'base',
  className,
  children,
  ...rest
}) {
  const themeProps = theme
    ? isolated
      ? { 'data-theme': theme, 'data-themed': '' }
      : { 'data-section-theme': theme }
    : {};

  return (
    <Tag
      className={cn(
        SPACE[space],
        isolated && 'bg-bg text-fg',
        // Anchor targets must clear the fixed navigation.
        'relative scroll-mt-[var(--nav-height)]',
        className
      )}
      {...themeProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}
