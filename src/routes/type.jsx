import { useEffect, useState } from 'react';
import '../styles/fonts-candidates.css';

import { Container } from '../components/layout/Container.jsx';
import { Label } from '../components/ui/Label.jsx';
import { Hero } from '../components/hero/Hero.jsx';
import { cn } from '../lib/cn.js';

export const meta = () => [
  { title: 'Typography bake-off — RELAT' },
  { name: 'robots', content: 'noindex, nofollow' },
];

/**
 * Weights are the sizes of the self-hosted latin woff2 subsets in
 * public/fonts. Mono (IBM Plex Mono, 9.8kB) is constant and excluded.
 */
const CANDIDATES = [
  {
    id: 'grotesk',
    name: 'A — Grotesk',
    display: 'Schibsted Grotesk',
    body: 'Schibsted Grotesk',
    weight: '45.8kB',
    axes: 'Variable 400–900',
    licence: 'OFL',
    note: 'One family throughout. Confident and current, but the least distinctive of the four — it asks the composition to carry the personality.',
  },
  {
    id: 'editorial',
    name: 'B — Editorial',
    display: 'Instrument Serif',
    body: 'Schibsted Grotesk',
    weight: '60.5kB',
    axes: 'Static 400 + italic / Variable 400–900',
    licence: 'OFL',
    note: 'High-contrast serif against a neutral grotesk. Most editorial at scale; the single weight is a real constraint at small display sizes.',
  },
  {
    id: 'human',
    name: 'C — Human',
    display: 'Fraunces',
    body: 'Archivo',
    weight: '99.9kB',
    axes: 'Variable 300–700 (opsz) / Variable 400–700',
    licence: 'OFL',
    note: 'The warmest and most characterful. Optical sizing holds up across the scale. Watch it for a fashion or boutique reading at large sizes.',
  },
  {
    id: 'contemporary',
    name: 'D — Contemporary',
    display: 'Bricolage Grotesque',
    body: 'Archivo',
    weight: '109.2kB',
    axes: 'Variable 400–800 (opsz, wdth) / Variable 400–700',
    licence: 'OFL',
    note: 'Deliberately irregular. Most personality of the sans options, and the heaviest — the quirks read as intent at display size and as noise at body size.',
  },
];

const PROJECT_TITLES = [
  'Gecko Surf House',
  'Playa Carmen Studio',
  'Cabo Blanco Records',
];

export default function TypeBakeOff() {
  const [candidate, setCandidate] = useState('editorial');

  // The whole document is switched, not a subtree, so the fixed navigation and
  // every other component are part of the comparison.
  useEffect(() => {
    document.documentElement.dataset.typeface = candidate;
    return () => {
      delete document.documentElement.dataset.typeface;
    };
  }, [candidate]);

  const active = CANDIDATES.find((entry) => entry.id === candidate);

  return (
    <>
      {/* Fixed switcher, deliberately plain — it is scaffolding, not design. */}
      <div className="fixed inset-x-0 bottom-0 z-[200] border-t border-line bg-bg-raised">
        <Container width="wide" className="flex flex-wrap items-center gap-2xs py-2xs">
          {CANDIDATES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setCandidate(entry.id)}
              aria-pressed={candidate === entry.id}
              className={cn(
                'border px-md py-3xs font-mono text-micro uppercase tracking-label transition-colors duration-[--duration-fast]',
                candidate === entry.id
                  ? 'border-fg bg-fg text-bg'
                  : 'border-control-line text-fg-muted hover:border-fg hover:text-fg'
              )}
            >
              {entry.name}
            </button>
          ))}
          <span className="ml-auto font-mono text-micro text-fg-subtle">
            {active.display} / {active.body} · {active.weight}
          </span>
        </Container>
      </div>

      {/* 1 — The hero, as it actually is. The primary test. */}
      <Hero />

      {/* 2 — All four at once. Toggling compares faces against memory; this
        * compares them against each other. */}
      <section className="border-t border-line py-2xl">
        <Container width="wide">
          <Label>Side by side</Label>
          <p className="mt-2xs max-w-text text-body-sm text-fg-muted">
            Same words, same sizes, same spacing. The only variable is the typeface.
          </p>

          <div className="mt-xl grid gap-lg lg:grid-cols-2">
            {CANDIDATES.map((entry) => (
              <article
                key={entry.id}
                data-typeface={entry.id}
                // `font-body` is required, not decorative: body sets
                // font-family from --font-body once, and descendants inherit
                // the resolved value. Re-declaring it here is what makes the
                // card's own --font-* actually take effect.
                className={cn(
                  'flex flex-col border p-lg font-body transition-colors duration-[--duration-base]',
                  candidate === entry.id ? 'border-fg' : 'border-line'
                )}
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2xs">
                  <span className="font-mono text-label uppercase tracking-label">
                    {entry.name}
                  </span>
                  <span className="font-mono text-micro text-fg-subtle">
                    {entry.display} / {entry.body} · {entry.weight}
                  </span>
                </header>

                <p className="mt-lg font-display text-display-3">Relate</p>

                <p className="mt-md font-display text-heading-1">
                  Good digital work starts with understanding.
                </p>

                <p className="mt-md font-display text-heading-2 text-fg-muted">
                  Gecko Surf House
                </p>

                <p className="mt-md max-w-text text-body text-fg-muted">
                  Before designing or developing, RELAT seeks to understand the person,
                  the business and the audience. The result should feel considered
                  rather than assembled.
                </p>

                <p className="mt-md font-mono text-micro uppercase tracking-label text-fg-subtle">
                  Santa Teresa, Costa Rica — 2026
                </p>

                <button
                  type="button"
                  onClick={() => setCandidate(entry.id)}
                  className="mt-lg self-start border border-control-line px-md py-3xs font-mono text-micro uppercase tracking-label text-fg-muted transition-colors duration-[--duration-fast] hover:border-fg hover:text-fg"
                >
                  Apply to page
                </button>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 3 — Everything else the face has to survive. */}
      <section className="border-t border-line py-2xl">
        <Container width="wide">
          <Label>Candidate</Label>
          <h2 className="mt-md text-display-3">{active.name}</h2>
          <dl className="mt-lg grid gap-md sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Display', active.display],
              ['Body', active.body],
              ['Axes', active.axes],
              ['Subset weight', `${active.weight} · ${active.licence}`],
            ].map(([term, value]) => (
              <div key={term} className="border-t border-line pt-2xs">
                <dt className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                  {term}
                </dt>
                <dd className="mt-3xs text-body-sm">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-lg max-w-text text-body-sm text-fg-muted">{active.note}</p>
        </Container>
      </section>

      <section className="border-t border-line py-2xl" data-section-theme="dark">
        <Container width="wide">
          <Label>Project titles</Label>
          <p className="mt-2xs max-w-text text-micro text-fg-subtle">
            Placeholder names — not RELAT projects, and not presented as work.
            Included only so the face can be judged at index scale.
          </p>
          <ul className="isolate-group mt-lg flex flex-col border-t border-line">
            {PROJECT_TITLES.map((title, index) => (
              <li
                key={title}
                className="isolate-item flex items-baseline justify-between gap-md border-b border-line py-md"
              >
                <span className="text-display-3">{title}</span>
                <Label className="shrink-0 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </Label>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line py-2xl" data-section-theme="warm">
        <Container width="wide">
          <div className="grid gap-2xl lg:grid-cols-2">
            <div>
              <Label>Large display</Label>
              <p className="mt-md text-display-2">Relate</p>
              <p className="mt-md text-display-3">Strategy, design, technology</p>
              <p className="mt-md text-heading-1">Creative Technology</p>
            </div>

            <div>
              <Label>Body copy</Label>
              <p className="mt-md max-w-text text-body-lg">
                Before designing or developing, RELAT seeks to understand the person,
                the business and the audience.
              </p>
              <p className="mt-md max-w-text text-body text-fg-muted">
                The result should feel considered rather than assembled. The promise is
                not that every project will be experimental — it is that every project
                will be intentional, well designed and technically sound. A small studio
                allows direct communication and involvement, and that is usually what
                makes the difference between a website that works and one that matters.
              </p>
              <p className="mt-md max-w-text text-body-sm text-fg-muted">
                Visual systems, interaction and responsive design. Understanding the
                business, the audience and the opportunity.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-2xl pb-4xl">
        <Container width="wide">
          <Label>Notes</Label>
          <p className="mt-md max-w-text text-body-sm text-fg-muted">
            Navigation is part of the test — the wordmark and menu at the top of this
            page change with each candidate. Mobile is evaluated by viewing this page at
            phone width rather than in a simulated frame, because the type scale is
            viewport-driven and a scaled-down preview would misreport it.
          </p>
        </Container>
      </section>
    </>
  );
}
