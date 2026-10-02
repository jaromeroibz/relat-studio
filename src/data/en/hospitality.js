/**
 * Hospitality — English.
 *
 * Copy for `/hospitality-web-design/`, RELAT's first dedicated vertical page.
 * Approved per the hospitality copy blueprint; two lines are reused verbatim
 * from the live Gecko Surf House case study rather than re-written here —
 * see the comments beside them — so the two pages never disagree about the
 * same facts.
 *
 * Content honesty (docs/E-brand-constitution.md, CLAUDE.md): Gecko Surf House
 * was completed by RELAT's founder before the studio existed
 * (`projects.js`'s `attribution: 'prior-work'`). `proof.attribution` carries
 * the same disclosure the project page itself shows — this page must not
 * read as a claim that RELAT, the studio, built it.
 */

export const hospitality = {
  meta: {
    title: 'Hospitality Web Design',
    description:
      'RELAT designs and builds hospitality websites for independent hotels, hostels and lodges — from room discovery through booking.',
  },

  hero: {
    eyebrow: ['Santa Teresa, Costa Rica', 'Working with independent hospitality'],
    headline: ['Hospitality websites', 'built around discovery', 'and booking.'],
    headlineLabel: 'Hospitality websites built around discovery and booking.',
    body: 'For independent hotels, hostels, lodges and stays, the website is often the first part of the guest experience. RELAT designs and builds that experience end to end — from first look to booked room.',
  },

  guestJourney: {
    label: 'The guest journey',
    heading: 'The website is part of the stay.',
    body: [
      "Before a guest arrives, they've already formed an opinion of the place. They've looked through rooms, compared rates, pictured themselves there. That happens on the website — not after it.",
      'Treating design, content and booking as separate layers is what makes that moment feel disjointed: a considered homepage that leads to a clumsy booking widget, or a fast checkout bolted onto a slow, generic site.',
      'RELAT designs the whole path — discover, understand, choose, book — as one experience, not a handoff between them.',
    ],
  },

  // The editorial/motion device for the journey itself — see hospitality-web-design.jsx.
  journeySteps: ['Discover', 'Understand', 'Choose', 'Book'],

  discovery: {
    heading: 'From a room to a reservation.',
    body: [
      "A hospitality website has to answer specific questions quickly. What's this place like? What's the actual difference between this room and that one? Is this where I want to be?",
      "That means photography used with intention, room and rate information that's easy to compare, and a sense of place that comes through before a single word is read.",
    ],
    media: 'site-home',
  },

  booking: {
    body: [
      "Once someone's decided, the path to booking should feel like a continuation of that decision, not a detour. A clear call to action, a booking step that works as well on a phone as a desktop, and a handoff to the booking engine that doesn't break the experience it took to get there.",
      'Design and booking logic are built together here — not stitched together afterward.',
    ],
    media: 'rooms-index',
  },

  proof: {
    label: 'Gecko Surf House',
    category: 'Hospitality Website',
    capabilities: ['Web Design', 'Frontend Development', 'Booking Integration'],
    heading: 'The website had to sell rooms, not just show them.',
    body: [
      'Gecko Surf House needed a site that worked as hard as the property itself — room discovery, a clear booking journey, and a responsive experience designed to work naturally across screens.',
      // Reused verbatim from src/data/en/projects.js's own Gecko story — the
      // one sentence that describes the Lodgify connection, already approved
      // and already factual. Not rewritten here, on purpose.
      'Booking and availability connect through Lodgify, creating a continuous path from room discovery to reservation.',
    ],
    media: { anchor: 'booking-calendar', secondary: 'mobile-booking' },
    // No testimonial exists yet. Left undefined rather than an empty string,
    // so the module's own conditional render (not a placeholder) decides
    // whether anything shows — see hospitality-web-design.jsx.
    testimonial: undefined,
    // Reused verbatim from ProjectHeader.jsx's ATTRIBUTION_NOTE — the same
    // disclosure the live case study shows, required by CLAUDE.md's content-
    // honesty rule whenever work predating RELAT is shown as proof.
    attribution: "Selected work completed by RELAT's founder prior to the studio's launch.",
  },

  builtAsOne: {
    heading: 'Built as one experience.',
    body: [
      "Strategy, design, development and the systems that connect to a booking engine aren't separate stages here — they're one practice, from first conversation to launch.",
      "A decision made in design doesn't get lost by the time it reaches the booking flow, because nothing is handed off in between.",
    ],
  },

  localContext: {
    heading: 'Hospitality is not abstract here.',
    body: [
      "RELAT works from Santa Teresa, on Costa Rica's Pacific coast — a place shaped by independent hospitality and the businesses around it.",
      'That proximity makes the questions behind this work tangible: how someone discovers a place, understands it, and decides to book.',
    ],
  },

  cta: {
    heading: 'Have a property in mind?',
    action: { label: 'Start a project', to: '/#contact' },
  },
};
