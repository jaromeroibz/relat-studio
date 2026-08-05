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


# TOKEN & CONTEXT EFFICIENCY

This project is being developed on a limited Claude Code plan.

Optimize aggressively for token and context efficiency without sacrificing code quality.

## 1. Minimize unnecessary context

Do NOT repeatedly reread documentation or source files that have already been inspected during the current task unless:

* the file has changed
* the relevant section is unknown
* the previous understanding is insufficient

Do not reread the entire repository when only one component is relevant.

Prefer targeted inspection of specific files and sections.

---

## 2. Keep responses concise

Do not provide long explanations of implementation details unless requested.

After making changes, report only:

* what changed
* which files changed
* important decisions
* whether tests/build passed
* any issue requiring attention

Do NOT paste entire files into the response.

Do NOT explain unchanged code.

---

## 3. Plan before acting

For non-trivial tasks:

1. Inspect only the relevant files.
2. Form a concise implementation plan.
3. Execute the complete related change.
4. Run the minimum necessary validation.
5. Report the result.

Avoid repeatedly switching between planning and implementation.

---

## 4. Batch related changes

When several changes belong to the same task, implement them together.

Avoid:

* changing one file
* stopping
* explaining
* rereading everything
* changing another file
* stopping again

Prefer completing a coherent task in one pass.

---

## 5. Avoid unnecessary exploration

Do not browse the web, search for libraries, inspect unrelated dependencies or explore alternative implementations unless there is a concrete reason.

Use existing project dependencies whenever possible.

Before adding a dependency, verify that the existing stack cannot reasonably solve the problem.

---

## 6. Avoid unnecessary dependencies

Do not install a package for a behavior that can be implemented cleanly with the existing stack.

Every new dependency should have a clear technical justification.

---

## 7. Do not over-engineer

Prefer the simplest implementation that satisfies:

* UX requirements
* visual requirements
* accessibility
* performance
* maintainability

Do not create abstractions, components or utilities before they are actually needed.

---

## 8. Preserve working code

Do not refactor unrelated code while implementing a feature.

If an existing implementation works, leave it alone unless the current task requires changing it.

Avoid broad rewrites.

---

## 9. Validation should be proportional

Run the smallest useful validation for the task.

For a CSS change, do not perform a full repository audit.

For a component change, run the relevant build/lint checks.

For a major architectural change, run the full appropriate validation.

Do not repeatedly run expensive commands without a reason.

---

## 10. Visual iteration

For visual work:

1. Build the smallest meaningful implementation.
2. Inspect the result.
3. Identify the highest-impact visual issue.
4. Fix that issue.
5. Repeat only when necessary.

Do not make dozens of speculative visual changes at once.

Prioritize:

1. composition
2. typography
3. spacing
4. hierarchy
5. motion
6. micro-details

---

## 11. Avoid unnecessary commentary

Do not narrate every action.

Avoid messages such as:

* "I'm going to inspect..."
* "Now I'll open..."
* "Next I'll check..."
* "Let me think about..."

Only communicate when there is a meaningful decision, blocker or result.

---

## 12. Context preservation

Keep track of decisions already made during the project.

Do not repeatedly ask for information that is already documented in:

* CLAUDE.md
* README.md
* `/docs`
* previous approved implementation decisions

When a decision is already established, follow it.

---

## 13. Ask only important questions

Ask for clarification only when the answer materially affects:

* architecture
* design direction
* content
* functionality
* scope
* technical implementation

Do not interrupt the workflow for minor decisions that can reasonably be made using the existing documentation.

---

## 14. Completion behavior

When a task is complete, provide a concise summary:

**Changed**

* file/path — short description

**Validation**

* build/lint/test result

**Next**

* only if another action is genuinely required

Do not provide a long narrative unless requested.

---

## 15. Primary objective

Use tokens for:

**understanding → decision-making → implementation → validation**

Do not spend context on:

**repetition → narration → unnecessary exploration → redundant explanations**

Optimize for high-quality output per token.

