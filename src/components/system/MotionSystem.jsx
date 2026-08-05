import { useState } from 'react';
import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Label } from '../ui/Label.jsx';
import { Button } from '../ui/Button.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { useMotion } from '../../lib/motion-context.js';
import { useMotionDurations } from '../../hooks/useMotionTokens.js';
import { GSAP_EASE } from '../../lib/motion.js';
import { cn } from '../../lib/cn.js';

const EASINGS = [
  {
    name: 'out-expo',
    token: '--ease-out-expo',
    points: [0.16, 1, 0.3, 1],
    gsap: GSAP_EASE.outExpo,
    role: 'Entrances. Fast departure, long settle — the house curve.',
  },
  {
    name: 'out-quint',
    token: '--ease-out-quint',
    points: [0.22, 1, 0.36, 1],
    gsap: GSAP_EASE.outQuint,
    role: 'Hover and small state changes. Slightly softer.',
  },
  {
    name: 'in-out-quart',
    token: '--ease-in-out-quart',
    points: [0.76, 0, 0.24, 1],
    gsap: GSAP_EASE.inOutQuart,
    role: 'Theme cross-fades and anything that travels both ways.',
  },
  {
    name: 'standard',
    token: '--ease-standard',
    points: [0.4, 0, 0.2, 1],
    gsap: GSAP_EASE.standard,
    role: 'Utility. Opacity, colour, things that should not be noticed.',
  },
];

const DURATIONS = [
  ['instant', '--duration-instant', 'Colour on press'],
  ['fast', '--duration-fast', 'Hover feedback'],
  ['base', '--duration-base', 'Standard transition'],
  ['slow', '--duration-slow', 'Larger elements, image scale'],
  ['slower', '--duration-slower', 'Full-width movement'],
  ['reveal', '--duration-reveal', 'Entrance from below'],
  ['theme', '--duration-theme', 'Background cross-fade'],
];

function CurvePlot({ points }) {
  const [x1, y1, x2, y2] = points;
  return (
    <svg viewBox="-6 -6 112 112" className="h-24 w-24 shrink-0" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="var(--line)" />
      <line x1="0" y1="100" x2="100" y2="0" stroke="var(--line)" strokeDasharray="3 3" />
      <path
        d={`M 0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function EasingRow({ easing, playing }) {
  return (
    <div className="flex flex-col gap-sm border-b border-line py-lg last:border-0 sm:flex-row sm:items-center sm:gap-lg">
      <CurvePlot points={easing.points} />

      <div className="flex min-w-0 flex-1 flex-col gap-2xs">
        <div className="flex flex-wrap items-baseline gap-sm">
          <Label className="text-fg">{easing.name}</Label>
          <span className="font-mono text-micro text-fg-subtle">
            cubic-bezier({easing.points.join(', ')})
          </span>
          <span className="font-mono text-micro text-fg-subtle">gsap: {easing.gsap}</span>
        </div>
        <span className="text-micro text-fg-subtle">{easing.role}</span>

        <div
          className="mt-2xs h-8 w-full border border-line bg-bg-raised"
          style={{ containerType: 'inline-size' }}
        >
          <div
            className="h-full w-8 bg-accent"
            style={{
              transform: playing ? 'translateX(calc(100cqw - 2rem))' : 'translateX(0)',
              transitionProperty: 'transform',
              transitionDuration: 'var(--duration-slower)',
              transitionTimingFunction: `var(${easing.token})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Live readout of the three motion tiers, resolved for this visitor. */
function CapabilityReadout() {
  const motion = useMotion();

  const rows = [
    ['prefers-reduced-motion', motion.prefersReducedMotion, 'Tier 1 — overrides everything'],
    ['pointer: fine', motion.canHover, 'Tier 2 — gates hover and cursor'],
    ['viewport ≥ 1024px', motion.isDesktop, 'Tier 3 — gates parallax'],
  ];

  const outcomes = [
    ['Reveals & theme transitions', motion.allowMotion],
    ['Hover interactions', motion.allowHover],
    ['Parallax', motion.allowParallax],
    ['Custom cursor', motion.allowCursor],
    ['Lenis smooth scroll', motion.allowMotion],
  ];

  return (
    <div className="grid gap-lg lg:grid-cols-2">
      <div>
        <Label className="text-fg">Detected</Label>
        <ul className="mt-md flex flex-col">
          {rows.map(([label, value, note]) => (
            <li
              key={label}
              className="flex items-baseline justify-between gap-md border-b border-line py-2xs last:border-0"
            >
              <span className="flex flex-col">
                <span className="font-mono text-micro">{label}</span>
                <span className="text-micro text-fg-subtle">{note}</span>
              </span>
              <span
                className={cn(
                  'font-mono text-micro uppercase tracking-label',
                  value ? 'text-accent' : 'text-fg-subtle'
                )}
              >
                {value ? 'yes' : 'no'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Label className="text-fg">Resolved</Label>
        <ul className="mt-md flex flex-col">
          {outcomes.map(([label, value]) => (
            <li
              key={label}
              className="flex items-baseline justify-between gap-md border-b border-line py-2xs last:border-0"
            >
              <span className="font-mono text-micro">{label}</span>
              <span
                className={cn(
                  'font-mono text-micro uppercase tracking-label',
                  value ? 'text-accent' : 'text-fg-subtle'
                )}
              >
                {value ? 'on' : 'off'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function MotionSystem() {
  const [playing, setPlaying] = useState(false);
  const [revealKey, setRevealKey] = useState(0);
  const [demoTheme, setDemoTheme] = useState('light');
  const durations = useMotionDurations();

  return (
    <SystemBlock
      id="motion"
      index="07"
      title="Motion"
      description="Four curves and seven durations, defined once in CSS and read back by JavaScript so scripted animation and CSS transitions can never drift apart."
    >
      <SystemRow
        label="Capability"
        note="Resolved live for your browser right now. Turn on reduced motion in your OS and watch this change."
      >
        <CapabilityReadout />
      </SystemRow>

      <SystemRow label="Easing" note="Press play and compare the settle, not the start.">
        <div className="flex flex-col">
          <div className="pb-md">
            <Button variant="secondary" onClick={() => setPlaying((value) => !value)}>
              {playing ? 'Return' : 'Play'}
            </Button>
          </div>
          {EASINGS.map((easing) => (
            <EasingRow key={easing.name} easing={easing} playing={playing} />
          ))}
        </div>
      </SystemRow>

      <SystemRow
        label="Duration"
        note="Values read from CSS at runtime — this table is the same source GSAP uses."
      >
        <ul className="flex flex-col">
          {DURATIONS.map(([name, token, role]) => (
            <li
              key={name}
              className="flex flex-wrap items-baseline gap-sm border-b border-line py-2xs last:border-0"
            >
              <Label className="w-24 shrink-0 text-fg">{name}</Label>
              <span className="w-16 font-mono text-micro tabular-nums text-fg-subtle">
                {durations ? `${durations[name]}ms` : '—'}
              </span>
              <span className="font-mono text-micro text-fg-subtle">{token}</span>
              <span className="text-micro text-fg-subtle">{role}</span>
            </li>
          ))}
        </ul>
      </SystemRow>

      <SystemRow
        label="Theme transition"
        note="The light → dark → warm progression, isolated. On the real page this is driven by whichever section owns the middle of the viewport."
      >
        <div className="flex flex-col gap-md">
          <div className="flex flex-wrap gap-2xs">
            {['light', 'dark', 'warm'].map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setDemoTheme(theme)}
                aria-pressed={demoTheme === theme}
                className={cn(
                  'border px-md py-2xs font-mono text-label uppercase transition-colors duration-[--duration-fast]',
                  demoTheme === theme
                    ? 'border-fg bg-fg text-bg'
                    : 'border-control-line text-fg-muted hover:border-fg hover:text-fg'
                )}
              >
                {theme}
              </button>
            ))}
          </div>

          <div data-theme={demoTheme} data-themed className="bg-bg p-xl text-fg">
            <Label>Approach</Label>
            <p className="mt-md text-display-3">Good digital work starts with understanding.</p>
            <p className="mt-md max-w-text text-body text-fg-muted">
              Everything cross-fades together — background, text, rules and accent — over{' '}
              <span className="font-mono text-micro">--duration-theme</span> on{' '}
              <span className="font-mono text-micro">in-out-quart</span>.
            </p>
            <div className="mt-lg flex flex-wrap items-center gap-md">
              <Button variant="primary">Start a conversation</Button>
              <Button variant="secondary">View work</Button>
            </div>
          </div>
        </div>
      </SystemRow>

      <SystemRow
        label="Reveal"
        note="The entrance primitive. Hidden only when motion is permitted — otherwise content simply exists."
      >
        <div className="flex flex-col gap-md">
          <Button variant="secondary" onClick={() => setRevealKey((key) => key + 1)}>
            Replay
          </Button>
          <div key={revealKey} className="grid gap-md sm:grid-cols-3">
            {[0, 90, 180].map((delay) => (
              <Reveal
                key={delay}
                delay={delay}
                className="border border-line bg-bg-raised p-lg"
              >
                <Label className="text-fg">delay {delay}ms</Label>
                <p className="mt-2xs text-body-sm text-fg-muted">
                  Travels {`var(--reveal-distance)`} on out-expo.
                </p>
              </Reveal>
            ))}
          </div>
          <p className="max-w-text text-micro text-fg-subtle">
            Three steps is the limit. Beyond that a stagger stops reading as choreography
            and starts reading as waiting.
          </p>
        </div>
      </SystemRow>
    </SystemBlock>
  );
}
