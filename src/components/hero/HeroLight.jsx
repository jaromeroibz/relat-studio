/**
 * The hero's atmosphere.
 *
 * Not a background image and not a decorative gradient — a light source, the
 * shadow it implies, and a surface catching it. The layers exist separately so
 * the exit timeline can move them independently; styling lives in
 * src/styles/hero.css.
 *
 * Entirely decorative, so the whole field is hidden from assistive technology:
 * there is nothing here to describe.
 *
 * @param {object} props
 * @param {import('react').RefObject<HTMLElement>} props.bloomRef
 * @param {import('react').RefObject<HTMLElement>} props.sheenRef
 * @param {import('react').RefObject<HTMLElement>} props.deepenRef
 */
export function HeroLight({ bloomRef, sheenRef, deepenRef }) {
  return (
    <div className="hero-field" aria-hidden="true">
      {/* The inner element carries the light; the outer carries the mask in
        * the film variant. Splitting them is what lets the light drift while
        * the grain stays put — grain that moves reads as television static,
        * not as emulsion. Inert in the default hero. */}
      <div ref={bloomRef} className="hero-field__bloom">
        <div className="hero-field__bloom-inner" />
      </div>
      <div className="hero-field__fall" />
      <div ref={sheenRef} className="hero-field__sheen" />
      <div className="hero-field__grain" />
      {/* Variant-only: the single geometric form. Hidden unless the arc
        * direction is selected. */}
      <div className="hero-field__form" />
      <div ref={deepenRef} className="hero-field__deepen" />
    </div>
  );
}
