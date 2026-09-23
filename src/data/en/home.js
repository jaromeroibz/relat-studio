/**
 * Home — English.
 *
 * The hero states the studio's position and stops. It is not a summary of the
 * business (docs/E-brand-constitution.md §15) — the line below is the brand
 * idea from docs/B §2, set at scale.
 */

export const hero = {
  eyebrow: 'Digital Studio — Santa Teresa, Costa Rica',

  // Lines are authored, not wrapped. Where a display headline breaks is a
  // composition decision, so it is content, not a side effect of the viewport.
  headline: ['Good digital work', 'starts with', 'understanding.'],

  // Read by assistive technology in place of the split lines above.
  headlineLabel: 'Good digital work starts with understanding.',

  scrollCue: 'Scroll',

  // Editorial, not SaaS — mono links with a direction, not pill buttons.
  actions: {
    primary: { label: 'Start a project', to: '/#contact' },
    secondary: { label: 'View selected work', to: '/#work' },
  },
};

/**
 * The homepage's one closing invitation — poster-scale, plain text, left to
 * wrap on its own (see PosterCTA.jsx); no authored line break and no arrow.
 * It sits once, late in the sequence (About → Start a Project → Contact),
 * as the title card for the form beneath it.
 */
export const startAProject = {
  heading: 'Have something in mind?',
  action: { label: 'Start a project', to: '/#contact' },
};
