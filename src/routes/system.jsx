import { Container } from '../components/layout/Container.jsx';
import { Label } from '../components/ui/Label.jsx';
import { SystemBlock, SystemRow } from '../components/system/SystemBlock.jsx';
import { TypeSystem } from '../components/system/TypeSystem.jsx';
import { SpaceSystem } from '../components/system/SpaceSystem.jsx';
import { ColorSystem } from '../components/system/ColorSystem.jsx';
import { ShapeSystem } from '../components/system/ShapeSystem.jsx';
import { ControlSystem } from '../components/system/ControlSystem.jsx';
import { MotionSystem } from '../components/system/MotionSystem.jsx';
import { BreakpointSystem } from '../components/system/BreakpointSystem.jsx';

export const meta = () => [
  { title: 'Design system — RELAT' },
  { name: 'robots', content: 'noindex, nofollow' },
];

const INDEX = [
  ['01', 'Principles', '#principles'],
  ['02', 'Typography', '#type'],
  ['03', 'Space & measure', '#space'],
  ['04', 'Colour', '#color'],
  ['05', 'Shape', '#shape'],
  ['06', 'Controls & states', '#controls'],
  ['07', 'Motion', '#motion'],
  ['08', 'Responsive', '#responsive'],
];

const PRINCIPLES = [
  [
    'Tokens are the only source',
    'Nothing hardcodes a colour, size, space or duration. If a value is not in the system, it does not exist yet.',
  ],
  [
    'Content is visible by default',
    'Entrances hide content only when motion is permitted and JavaScript is running. Every failure mode ends with the content on screen.',
  ],
  [
    'One sense of time',
    'CSS owns the timing values; JavaScript reads them back. GSAP and CSS transitions cannot drift apart.',
  ],
  [
    'Zero radius until proven otherwise',
    'Rounding is an exception. Structure comes from rules, edges and space.',
  ],
  [
    'Three compositions',
    'Mobile, tablet and desktop are designed, not derived. Hover always has a touch equivalent.',
  ],
  [
    'Every effect answers a question',
    'Does this improve the experience? If the answer is not obvious, it comes out.',
  ],
];

export default function System() {
  return (
    <>
      <header className="pt-5xl pb-2xl">
        <Container width="wide">
          <Label>Phase 1 — Foundation</Label>
          <h1 className="mt-md text-display-2">Design system</h1>
          <p className="mt-lg max-w-narrow text-body-lg text-fg-muted">
            The vocabulary the site is built from, before any of it is used to build a
            page. This is a working document — it is laid out for judgement, not for
            persuasion.
          </p>
          <p className="mt-md max-w-narrow text-body-sm text-fg-subtle">
            Typography is deliberately font-agnostic at this stage. The typeface decision
            happens in Phase 2, inside the real hero, rather than being chosen upfront
            from a specimen.
          </p>

          <nav aria-label="System index" className="mt-2xl">
            <ul className="isolate-group grid gap-2xs sm:grid-cols-2 lg:grid-cols-4">
              {INDEX.map(([number, title, href]) => (
                <li key={href} className="isolate-item">
                  <a
                    href={href}
                    className="flex items-baseline gap-sm border-t border-line py-2xs"
                  >
                    <span className="font-mono text-micro tabular-nums text-fg-subtle">
                      {number}
                    </span>
                    <span className="link-underline text-body-sm">{title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>

      <SystemBlock
        id="principles"
        index="01"
        title="Principles"
        description="Six rules that decide the arguments. Everything after this is an application of them."
      >
        <SystemRow label="Rules" note="If a decision contradicts one of these, the decision is wrong.">
          <ol className="grid gap-lg md:grid-cols-2">
            {PRINCIPLES.map(([title, body], index) => (
              <li key={title} className="flex gap-md border-t border-line pt-md">
                <span className="font-mono text-micro tabular-nums text-fg-subtle">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-heading-3">{title}</h3>
                  <p className="mt-2xs max-w-text text-body-sm text-fg-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </SystemRow>
      </SystemBlock>

      <TypeSystem />
      <SpaceSystem />
      <ColorSystem />
      <ShapeSystem />
      <ControlSystem />
      <MotionSystem />
      <BreakpointSystem />
    </>
  );
}
