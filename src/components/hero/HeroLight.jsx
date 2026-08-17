/**
 * The hero's atmosphere.
 *
 * A translucent refractive field across the right half of the frame: a warm
 * source, a material that bends the light passing through it, one highlight
 * sitting on the surface, and the shadow the source implies. Not a background
 * image and not a decorative gradient. Styling lives in src/styles/hero.css.
 *
 * The layers exist separately so the exit timeline can move them
 * independently, and so the material can drift inside a mask that stays put —
 * light travelling through fixed glass rather than the glass sliding.
 *
 * Entirely decorative, so the whole field is hidden from assistive technology.
 *
 * @param {object} props
 * @param {import('react').RefObject<HTMLElement>} props.bloomRef
 * @param {import('react').RefObject<HTMLElement>} props.refractRef
 * @param {import('react').RefObject<HTMLElement>} props.sheenRef
 * @param {import('react').RefObject<HTMLElement>} props.deepenRef
 */
export function HeroLight({ bloomRef, refractRef, sheenRef, deepenRef }) {
  return (
    <div className="hero-field" aria-hidden="true">
      <div ref={bloomRef} className="hero-field__bloom">
        <div className="hero-field__bloom-inner" />
      </div>

      <div className="hero-field__refract">
        <div ref={refractRef} className="hero-field__refract-inner" />
      </div>

      <div ref={sheenRef} className="hero-field__sheen" />
      <div className="hero-field__fall" />
      <div className="hero-field__grain" />
      <div ref={deepenRef} className="hero-field__deepen" />

      {/*
        The displacement that makes the material refract.

        Turbulence is deliberately low-frequency and large-scale: high
        frequencies through a displacement map give frosted glass and visual
        noise, large slow waves give thin glass and spatial presence. Scale is
        the dial for how much the field asserts itself.
      */}
      <svg className="hero-field__defs" aria-hidden="true" focusable="false">
        <filter
          id="relat-refract"
          x="-14%"
          y="-14%"
          width="128%"
          height="128%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0034 0.0078"
            numOctaves="3"
            seed="7"
            result="warp"
          />
          <feGaussianBlur in="warp" stdDeviation="3" result="softWarp" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softWarp"
            scale="74"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}
