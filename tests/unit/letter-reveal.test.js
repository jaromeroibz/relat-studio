import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gsap } from 'gsap';
import { LETTER_REVEAL_VARS } from '../../src/lib/letterReveal.js';

// GSAP writes `parent` onto the vars object it is handed. LETTER_REVEAL_VARS
// used to be shared by the Hero intro and the Statement timeline, so whichever
// built first became the other tween's parent. These tests pin the fix.

test('LETTER_REVEAL_VARS is frozen', () => {
  assert.ok(Object.isFrozen(LETTER_REVEAL_VARS));
});

test('passing the shared object straight to a timeline fails loudly', () => {
  const tl = gsap.timeline({ paused: true });
  assert.throws(() => tl.to({}, LETTER_REVEAL_VARS, 0), TypeError);
});

test('a copy is accepted, and the shared object is left untouched', () => {
  const tl = gsap.timeline({ paused: true });
  tl.to({}, { ...LETTER_REVEAL_VARS }, 0);
  assert.equal('parent' in LETTER_REVEAL_VARS, false);
  assert.deepEqual(Object.keys(LETTER_REVEAL_VARS).sort(), ['duration', 'ease', 'opacity', 'stagger', 'yPercent']);
});

test('two animations built from the shared constant keep their own parents', () => {
  const statement = gsap.timeline({ paused: true });
  statement.to({}, { ...LETTER_REVEAL_VARS }, 0);

  // The Hero intro's call: a plain `gsap.to` with a copy, after the Statement
  // timeline above has already used the constant.
  const intro = gsap.to({}, { ...LETTER_REVEAL_VARS, paused: true });

  assert.equal(intro.parent, gsap.globalTimeline);
  assert.notEqual(intro.parent, statement);
});
