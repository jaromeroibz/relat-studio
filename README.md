# RELAT

**relat.studio**

Creative digital studio based in Santa Teresa, Costa Rica.

RELAT combines strategy, design, development and creative technology to create thoughtful digital experiences.

---

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site → build/client
npm run lint
```

React 19 · React Router 8 (framework mode) · Vite 7 · Tailwind v4 · Lenis · GSAP.
Every route is prerendered to real HTML at build time — there is no server.
Deployed on Netlify.

The design system is browsable at **`/system`** (noindex). It is the reference
for typography, space, colour, shape, controls, motion and breakpoints, and it
measures its own colour contrast in the browser rather than asserting it.

---

## Project Documentation

This repository contains the strategy and product documentation that should guide the development of the RELAT website.

### `/docs`

#### `A-strategy.md`

Business and audience strategy.

Defines:

- target audience
- positioning
- geographic strategy
- client profile
- differentiation
- growth strategy

#### `B-brand-strategy.md`

Overall brand strategy.

Defines:

- brand idea
- positioning
- personality
- verbal identity
- visual territory
- reference map
- brand principles

#### `C-brand-brief.md`

Condensed brand brief.

Defines:

- identity
- audience
- personality
- voice
- visual direction
- motion
- photography
- light/sun influence

#### `D-website-product-brief.md`

Website product strategy.

Defines:

- website objectives
- information architecture
- conversion strategy
- hero
- navigation
- project presentation
- motion
- responsive behavior
- performance
- SEO

#### `E-brand-constitution.md`

The full brand and design constitution — implementation principles, brand
constraints, technical direction and design rules.

### `/CLAUDE.md`

The operational instruction file for Claude Code: stack, conventions,
non-negotiables and phase status. It defers to `docs/E-brand-constitution.md`
for anything visual.

---

## How the Documents Work Together

Use the documents in this order:

**A → B → C → D → CLAUDE.md**

A establishes the business strategy.

B translates the business strategy into brand strategy.

C defines the resulting brand identity.

D translates the brand into a website product.

`CLAUDE.md` turns all of the above into practical instructions for development.

---

## Important Principle

The documentation is not meant to make the website rigid.

It establishes the direction and constraints within which creative decisions should be made.

When something is not explicitly defined, prioritize:

1. Brand coherence
2. User experience
3. Visual quality
4. Performance
5. Accessibility
6. Maintainability

---

## Brand North Star

> **Good digital work starts with understanding.**

RELAT should feel:

**Human × Digital**  
**Strategy × Creativity**  
**Design × Technology**  
**Stillness × Movement**

The final website should not simply explain RELAT.

**It should make the visitor experience RELAT.**
