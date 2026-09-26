import { Link } from 'react-router';
import { cn } from '../../lib/cn.js';
import { trackEvent, currentPath } from '../../lib/analytics.js';

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
 * @param {string} [props.placement] Where a `mailto:` link sits, reported with
 *   its `email_click` event (never the address itself).
 */
export function TextLink({ to, href, className, children, placement, onClick, ...rest }) {
  const classes = cn('link-underline', className);

  if (href) {
    // mailto: and tel: hand off to another application — they are not
    // navigation and must not be announced as opening a tab.
    const isHandoff = /^(mailto:|tel:)/.test(href);
    const isEmail = href.startsWith('mailto:');

    const handleClick = (event) => {
      if (isEmail) {
        trackEvent('email_click', { placement, page_path: currentPath() });
      }
      onClick?.(event);
    };

    return (
      <a
        href={href}
        target={isHandoff ? undefined : '_blank'}
        rel={isHandoff ? undefined : 'noreferrer'}
        className={classes}
        onClick={handleClick}
        {...rest}
      >
        {children}
        {!isHandoff && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
