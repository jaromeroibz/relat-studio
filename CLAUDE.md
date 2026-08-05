# CLAUDE.md — RELAT

Operational rules for working in this repository.

The **brand and design constitution** lives in `docs/E-brand-constitution.md`.
Read it before any visual, copy or interaction decision. It is the authority on
everything this file does not cover.

Document order: `docs/A` → `B` → `C` → `D` → `E`.

---

## Stack

| Concern      | Choice                                              |
| ------------ | --------------------------------------------------- |
| Framework    | React 19 + React Router 8 (framework mode)           |
| Build        | Vite 7                                               |
| Rendering    | Static — `ssr: false` + `prerender` (real HTML/route) |
| Styling      | Tailwind v4 (CSS-first `@theme`) + design tokens     |
| Smooth scroll| Lenis                                                |
| Choreography | GSAP + ScrollTrigger                                 |
| Language     | JavaScript + JSDoc (no TypeScript)                   |
| Hosting      | Netlify                                              |

```bash
npm run dev      # dev server
npm run build    # static build to build/client
npm run lint
```

---

## Non-negotiables

### Content honesty

Never invent projects, clients, testimonials, metrics or results. Work that
predates RELAT may appear as **Selected Work**, but must never imply RELAT
completed it — the `role`, `year` and `attribution` fields on every project
exist to make attribution explicit. See `src/data/projects.js`.

### Motion

- **Lenis** handles smooth scrolling. **GSAP/ScrollTrigger** handles
  choreography. Never use both for the same behaviour.
- Every animation reads its timing from `src/lib/motion.js`, which reads the CSS
  custom properties in `src/styles/tokens.css`. One source of truth for time.
- Animate `transform` and `opacity` only.
- Content is **visible by default**. Reveal components hide their content in an
  effect, only when motion is enabled — so content never disappears because JS
  failed or motion is reduced.

### Reduced motion

Three tiers, all handled in `MotionProvider`:

1. `prefers-reduced-motion: reduce` → Lenis never initialises, GSAP timelines
   jump to their end state, custom cursor off.
2. Coarse pointer → parallax off, hover interactions become tap or always-on.
3. Small viewport → scroll choreography reduced to reveals and theme changes.

### Typography

The type system is **font-agnostic until the Phase 2 bake-off**. Faces are
referenced only through `--font-display`, `--font-body` and `--font-mono`.
Never hardcode a family name in a component.

### Content separation

All copy lives in `src/data/`. Components receive it as props. The data shape is
i18n-ready (see `src/data/README.md`) — English ships now, Spanish must be
addable without restructuring.

---

## Conventions

- No component owns an entire page. Sections compose primitives.
- Spacing, colour, type and timing come from tokens. No magic numbers.
- Default border radius is `0`. Rounding is a deliberate exception, never a default.
- Semantic HTML first. One `h1` per page. Never remove focus outlines.
- Every image needs explicit dimensions or `aspect-ratio` to protect CLS.

## Performance budget

Release gate, not aspiration:

- LCP < 1.8s (4G), CLS < 0.05, INP < 200ms
- Initial JS ≤ 150kb gzipped
- Max two font families on first paint
- Lighthouse ≥ 95 across all four categories

---

## Phase status

- [x] **Phase 0** — Setup
- [x] **Phase 1** — Foundation (tokens, layout, navigation, motion architecture)
- [ ] **Phase 2** — Hero + typography bake-off
- [ ] **Phase 3** — Work
- [ ] **Phase 4** — Scroll system
- [ ] **Phase 5** — Capabilities / Approach / About / Contact
- [ ] **Phase 6** — Responsive
- [ ] **Phase 7** — Performance / A11y / SEO
- [ ] **Phase 8** — Polish

Do not start a phase before the previous one is approved.
