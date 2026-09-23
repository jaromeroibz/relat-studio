import { useRef } from 'react';
import { Section } from '../layout/Section.jsx';
import { useStatementSequence } from '../../hooks/useStatementSequence.js';
import { getContent } from '../../data/index.js';

/**
 * Brand Statement.
 *
 * The homepage's conceptual bridge: proof of work → RELAT's philosophy →
 * capabilities. One centred stage, typography only.
 *
 *   The best work isn't
 *   one discipline.            ← settles first, alone, then lifts
 *
 *   It's the                   ← quiet
 *   RELATionship               ← the protagonist: RELAT builds letter by
 *   between them.                letter, "ionship" completes it
 *
 * Layers, back to front: the cream plate (rises from below over Work's dark
 * ground — see statement.css for why it is a plate and not a theme change),
 * the persistent signature (fixed, z -1, deliberately quiet here — see
 * useWordmarkPresence), then the stage with the type. The stage is the only
 * thing that pins; the plate and the theme sentinels belong to the tall
 * wrapper so they are never trapped under the sticky stage's stacking context.
 *
 * Every word is its own overflow-hidden mask (never a fade-up), which is what
 * lets the sentence wrap naturally on small screens. Choreography lives in
 * useStatementSequence; without motion the finished statement is simply
 * there.
 */
export function Statement() {
  const { statement } = getContent();
  const sentence = `${statement.first} ${statement.lead} ${statement.word}${statement.suffix} ${statement.tail}`;

  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const groupRef = useRef(null);
  const whitePlateRef = useRef(null);

  useStatementSequence({ wrapperRef, stageRef, groupRef, whitePlateRef });

  return (
    <Section space="none" id="statement" data-wordmark-exit ref={wrapperRef} className="statement">
      {/* Theme sentinels, not content. ThemeController flips the document
        * theme when a `data-section-theme` element crosses the viewport's
        * centre line: these two sit either side of the point where the plate
        * has fully covered the screen, so the page stays dark under the rising
        * plate and only turns light once nothing dark is left visible — in
        * either scroll direction, with no scripting. */}
      <div aria-hidden="true" data-section-theme="dark" className="statement-sentinel statement-sentinel--dark" />
      <div aria-hidden="true" data-section-theme="light" className="statement-sentinel statement-sentinel--light" />

      <div aria-hidden="true" data-theme="light" className="statement-plate bg-bg" />

      {/* Capabilities' white ground, arriving from below during the handoff
        * (see useStatementSequence). Sticky and explicitly z -2, so it holds
        * the viewport like the stage does yet still sits under the persistent
        * signature. Desktop with motion only; elsewhere Capabilities' own
        * plate does the job as ordinary scroll. */}
      <div ref={whitePlateRef} aria-hidden="true" className="statement-white-plate" />

      <div ref={stageRef} data-theme="light" className="statement-stage text-fg">
        <p className="sr-only">{sentence}</p>

        <div ref={groupRef} aria-hidden="true" className="statement-group">
          <p data-part="first" className="statement-first font-display">
            <Words text={statement.first} breakAfter={4} />
          </p>

          <div className="statement-second">
            <p data-part="lead" className="statement-small font-display text-fg-muted">
              <Words text={statement.lead} />
            </p>

            <p className="statement-relat font-display">
              <span data-part="word" className="statement-word">
                <span className="statement-letters">
                  {[...statement.word].map((letter, i) => (
                    <span key={i} className="statement-mask statement-letter-mask">
                      <span data-part="letter" className="statement-mask-inner uppercase">
                        {letter}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="statement-mask">
                  <span data-part="suffix" className="statement-mask-inner">
                    {statement.suffix}
                  </span>
                </span>
              </span>
            </p>

            <p data-part="tail" className="statement-small font-display text-fg-muted">
              <Words text={statement.tail} />
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * A run of text as individually masked words, in a wrapping flex row so any
 * width breaks naturally and stays centred. `breakAfter` forces a line break
 * after that many words from `md` up only — the authored break holds on
 * desktop, and small screens are left to wrap.
 */
function Words({ text, breakAfter }) {
  const words = text.split(' ');

  return words.map((word, i) => (
    <span key={i} className="contents">
      <span className="statement-mask">
        <span data-part-word className="statement-mask-inner">
          {word}
        </span>
      </span>
      {breakAfter === i + 1 && <span className="statement-break" />}
    </span>
  ));
}
