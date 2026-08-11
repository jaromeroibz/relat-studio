/**
 * Navigation — English.
 *
 * Four items, deliberately. See docs/E-brand-constitution.md §17.
 */

/**
 * RELAT reads as one homepage narrative, so navigation points at chapters of
 * it rather than at standalone pages. `/work` is the exception — the portfolio
 * index is a real route because project stories live under it.
 */
export const primaryNav = [
  { label: 'Work', to: '/#work' },
  { label: 'Services', to: '/#capabilities' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];

export const footerNav = {
  studio: [
    { label: 'Work', to: '/work' },
    { label: 'Capabilities', to: '/#capabilities' },
    { label: 'About', to: '/#about' },
    { label: 'Contact', to: '/#contact' },
  ],
  elsewhere: [],
};
