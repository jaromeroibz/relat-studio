/**
 * First tab stop on every page. Hidden until focused.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="
        sr-only focus-visible:not-sr-only
        focus-visible:fixed focus-visible:top-sm focus-visible:left-sm
        focus-visible:z-[300] focus-visible:bg-fg focus-visible:text-bg
        focus-visible:px-md focus-visible:py-xs
        focus-visible:text-label focus-visible:uppercase focus-visible:font-mono
      "
    >
      Skip to content
    </a>
  );
}
