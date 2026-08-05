import { Link } from 'react-router';
import { cn } from '../../lib/cn.js';

/**
 * An inline link.
 *
 * The underline is drawn from left to right on hover and retracts to the right
 * on exit — a small directional detail, but it is the difference between a
 * state change and a gesture.
 *
 * External links get `rel="noreferrer"` and are announced to screen readers.
 *
 * @param {object} props
 * @param {string} [props.to]   Internal route.
 * @param {string} [props.href] External URL.
 */
export function TextLink({ to, href, className, children, ...rest }) {
  const classes = cn('link-underline', className);

  if (href) {
    // mailto: and tel: hand off to another application — they are not
    // navigation and must not be announced as opening a tab.
    const isHandoff = /^(mailto:|tel:)/.test(href);

    return (
      <a
        href={href}
        target={isHandoff ? undefined : '_blank'}
        rel={isHandoff ? undefined : 'noreferrer'}
        className={classes}
        {...rest}
      >
        {children}
        {!isHandoff && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  );
}
