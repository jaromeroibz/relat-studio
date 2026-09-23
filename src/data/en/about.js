/**
 * About — English.
 *
 * PROVISIONAL COPY. Everything here is verifiable: where the studio is, what
 * it does, and the founder's two backgrounds. No history, no team size, no
 * years in business, no awards, no claims about results.
 *
 * `media.portrait` is a replaceable slot — swapping the file and dimensions
 * here is the entire process, no component changes.
 */

export const about = {
  label: 'About',
  heading: 'A studio built on understanding.',

  body: [
    'RELAT is a digital studio in Santa Teresa, Costa Rica, working with people and businesses that care how their brand exists online.',
    'It is run by one person with two backgrounds — music and creative work on one side, development on the other. That combination is the reason the studio starts every project by understanding the business before designing anything for it.',
  ],

  // The founder's two backgrounds, said plainly. Only true because `body`
  // above already says it — this is that same fact, quieter and compressed.
  statement: ['Creative thinking.', 'Technical execution.'],

  // Short, factual, no résumé language.
  facts: [
    { label: 'Based in', value: 'Santa Teresa, Costa Rica' },
    { label: 'Working', value: 'Across Costa Rica and remotely' },
    { label: 'Focused on', value: 'Taste and quality, not one industry' },
  ],

  media: {
    portrait: {
      src: '/about/founder-portrait.jpg',
      alt: 'Portrait of the RELAT founder, smiling, leaning against a sunlit wall',
      width: 1600,
      height: 2000,
    },
    portraitPending: 'Founder portrait',
  },
};
