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

      {/* Variant-only: the refracting material. The inner element carries its
        * own copy of the warm field and is what the filter bends, so the
        * distortion reads as the background being displaced rather than as a
        * panel laid over it. */}
      <div className="hero-field__refract">
        <div className="hero-field__refract-inner" />
      </div>

      {/* Filter definitions. Zero-size and inert until a variant references
        * them. Large, slow turbulence — glass, not noise. */}
      <svg className="hero-field__defs" aria-hidden="true" focusable="false">
        <filter
          id="relat-refract"
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.011"
            numOctaves="3"
            seed="7"
            result="warp"
          />
          <feGaussianBlur in="warp" stdDeviation="2.5" result="softWarp" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softWarp"
            scale="52"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div ref={deepenRef} className="hero-field__deepen" />
    </div>
  );
}
