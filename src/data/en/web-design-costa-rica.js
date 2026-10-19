/**
 * Web Design Costa Rica — English.
 *
 * Copy for `/web-design-costa-rica/`, RELAT's commercial landing page for the
 * studio's home market. Approved copy, used verbatim.
 *
 * Content honesty (docs/E-brand-constitution.md, CLAUDE.md): Scotty Grand is
 * RELAT's own work; Gecko Surf House and Bolaca were completed by RELAT's
 * founder before the studio existed (`attribution: 'prior-work'` in
 * `projects.js`). `work.attribution` carries that disclosure for the module
 * that shows all three — it must never read as RELAT, the studio, having built
 * the two.
 */

export const webDesignCostaRica = {
  meta: {
    title: 'Web Design Costa Rica',
    description:
      'RELAT is a digital studio in Santa Teresa, Costa Rica, creating custom websites through strategy, web design and development for brands and businesses.',
  },

  // Feeds the Service JSON-LD (seo.js).
  service: {
    name: 'Web Design in Costa Rica',
    serviceType: 'Web Design and Development',
    description:
      'Custom websites for brands and businesses in Costa Rica and internationally, created by a digital studio in Santa Teresa through strategy, web design and development.',
  },

  hero: {
    // Lines are authored, not wrapped; the sentence is read once by assistive
    // technology (HeroHeadline).
    headline: ['Web design in Costa Rica,', 'built around the business behind it.'],
    headlineLabel: 'Web design in Costa Rica, built around the business behind it.',
    body: 'RELAT is a digital studio based in Santa Teresa, Costa Rica. We combine strategy, web design and development to create custom websites that are clear, distinctive and built around what the business needs to do online.',
    actions: {
      primary: { label: 'Start a project', to: '/#contact' },
      secondary: { label: 'View selected work', to: '/work/' },
    },
  },

  approach: {
    label: 'Approach',
    heading: 'The website starts before the design.',
    body: [
      'Good web design begins with understanding the business: what it offers, who it needs to reach, what people need to understand, and what should happen next.',
      'RELAT uses that context to shape the structure, content hierarchy and experience before deciding how the site should look.',
    ],
    // The conclusion, set larger than the two paragraphs above it.
    conclusion:
      'The result is not a template adapted to a logo. It is a digital experience built around the specific role the website needs to play.',
  },

  disciplines: {
    heading: 'Strategy, design and development belong together.',
    items: [
      {
        index: '01',
        title: 'Strategy & UX',
        body: 'We define what the website needs to communicate, how people should move through it and which actions matter most.',
      },
      {
        index: '02',
        title: 'Web Design',
        body: 'Visual direction, typography, hierarchy, responsive composition and interaction are shaped around the brand rather than a predefined layout.',
      },
      {
        index: '03',
        title: 'Development',
        body: 'The approved experience is translated into a responsive, performant frontend, with the integrations and technical foundations the project requires.',
      },
    ],
  },

  work: {
    label: 'Selected work',
    heading: 'Different businesses. Different jobs to do.',
    intro:
      'The visual language changes from project to project. The process does not: understand the business, define the experience, then build it carefully.',
    // The approved attribution wording (ProjectHeader's ATTRIBUTION_NOTE),
    // naming the two projects it applies to.
    attribution:
      "Gecko Surf House and Bolaca: selected work completed by RELAT's founder prior to the studio's launch.",
    all: { label: 'View all work', to: '/work/' },
  },

  builds: {
    heading: 'Websites shaped around what they need to do.',
    items: [
      {
        title: 'Brand & business websites',
        body: 'For presenting a business clearly, positioning a brand and turning interest into a meaningful next action.',
      },
      {
        title: 'Hospitality websites',
        body: 'Property discovery, room journeys and booking integrations designed around the path from interest to reservation.',
        link: { label: 'Hospitality web design', to: '/hospitality-web-design/' },
      },
      {
        title: 'E-commerce',
        body: 'Product discovery, catalogues, product pages, carts and the integrations required around the shopping experience.',
      },
      {
        title: 'Custom integrations',
        body: 'Booking platforms, forms, analytics and other tools the business already depends on.',
      },
    ],
  },

  beyondLaunch: {
    heading: 'Built to work beyond launch.',
    body: [
      'A website is not finished when the desktop design looks right. RELAT considers responsive behavior, performance, accessibility, technical SEO and the systems the website needs to connect with as part of the same experience.',
      'After launch, support can continue through maintenance, optimization and growth work when the project requires it.',
    ],
  },

  costaRica: {
    label: 'Costa Rica',
    heading: 'Based in Santa Teresa. Working beyond it.',
    body: [
      "RELAT works from Santa Teresa on Costa Rica's Pacific coast, with businesses in Costa Rica and clients internationally.",
      'Being based here keeps the studio close to independent hospitality, brands and businesses shaped by an international audience, while the work itself is built for people wherever they are.',
      'Local projects can include in-person collaboration when useful. Remote collaboration is part of the normal process.',
    ],
  },

  process: {
    heading: 'From understanding to launch.',
    steps: [
      { index: '01', title: 'Understand', body: 'Business, audience, objectives and constraints.' },
      { index: '02', title: 'Structure', body: 'Content, pages, hierarchy and user journey.' },
      { index: '03', title: 'Design', body: 'Visual system, responsive layouts and interaction.' },
      { index: '04', title: 'Build', body: 'Frontend development, integrations, testing and performance.' },
      { index: '05', title: 'Launch & improve', body: 'Production, analytics and continued optimization when needed.' },
    ],
  },

  faq: {
    label: 'FAQ',
    heading: 'Questions before we begin.',
    items: [
      {
        question: 'Do you work with businesses across Costa Rica?',
        answer:
          'Yes. RELAT is based in Santa Teresa and can work with businesses throughout Costa Rica as well as international clients. Projects can be handled remotely, with in-person collaboration when location and scope make it useful.',
      },
      {
        question: 'Can RELAT handle both web design and development?',
        answer:
          'Yes. Strategy, UX, web design and frontend development can be handled as one connected process, reducing the gap between what is designed and what is ultimately built.',
      },
      {
        question: 'Do you use website templates?',
        answer:
          'RELAT designs the experience around the project rather than forcing the business into a fixed visual template. Existing platforms, booking systems or commerce tools can still be used when they are the right foundation — custom design does not mean rebuilding every underlying system.',
      },
      {
        question: 'Can you redesign an existing website?',
        answer:
          'Yes. A redesign can keep what is already working while improving structure, messaging, visual direction, responsive behavior and the technical implementation where necessary.',
      },
      {
        question: 'How much does a website cost in Costa Rica?',
        answer:
          'The investment depends on the size of the site, content requirements, integrations, e-commerce or booking functionality and the level of custom design and development involved. RELAT defines the scope and provides a proposal before the project begins.',
      },
      {
        question: 'How long does a website project take?',
        answer:
          'The timeline depends on scope, content readiness and technical requirements. After the initial discovery and project definition, RELAT establishes the deliverables and timeline before work begins.',
      },
      {
        question: 'Can RELAT help with SEO and maintenance after launch?',
        answer:
          'Yes. Ongoing work can include technical maintenance, SEO improvements, performance optimization, content updates and continued iteration based on the needs of the business.',
      },
    ],
  },
};
