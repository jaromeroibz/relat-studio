import { useEffect, useState } from 'react';
import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Label } from '../ui/Label.jsx';
import { cn } from '../../lib/cn.js';

const BREAKPOINTS = [
  ['sm', 480, 'Adjustment only'],
  ['md', 768, 'Tablet composition begins'],
  ['lg', 1024, 'Desktop composition begins'],
  ['xl', 1280, 'Adjustment only'],
  ['2xl', 1536, 'Adjustment only'],
];

const COMPOSITIONS = [
  {
    name: 'Mobile',
    range: '< 768px',
    grid: '4 columns',
    rules: [
      'No hover — interactions become tap or always-visible',
      'No parallax, no custom cursor',
      'Motion reduced to reveals and theme changes',
      'Larger touch targets, tighter type scale',
    ],
  },
  {
    name: 'Tablet',
    range: '768 – 1023px',
    grid: '8 columns',
    rules: [
      'Type scale recomposed, not scaled down',
      'Hover becomes tap-to-reveal',
      'Parallax off',
      'Navigation returns inline',
    ],
  },
  {
    name: 'Desktop',
    range: '≥ 1024px',
    grid: '12 columns',
    rules: [
      'Full scroll choreography',
      'Hover isolation and image reveals',
      'Parallax and custom cursor',
      'Widest measure available',
    ],
  },
];

export function BreakpointSystem() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const read = () => setWidth(window.innerWidth);
    read();
    window.addEventListener('resize', read, { passive: true });
    return () => window.removeEventListener('resize', read);
  }, []);

  const active =
    width == null
      ? null
      : width >= 1024
        ? 'Desktop'
        : width >= 768
          ? 'Tablet'
          : 'Mobile';

  return (
    <SystemBlock
      id="responsive"
      index="08"
      title="Responsive"
      description="Three intentional compositions, not one design scaled three ways. The extra breakpoints exist for adjustment — they never introduce a new layout idea."
    >
      <SystemRow label="Breakpoints" note="Five values. Two of them matter.">
        <ul className="flex flex-col">
          {BREAKPOINTS.map(([name, value, role]) => (
            <li
              key={name}
              className="flex flex-wrap items-baseline gap-sm border-b border-line py-2xs last:border-0"
            >
              <Label
                className={cn(
                  'w-16 shrink-0',
                  width != null && width >= value ? 'text-accent' : 'text-fg-subtle'
                )}
              >
                {name}
              </Label>
              <span className="w-20 font-mono text-micro tabular-nums text-fg-subtle">
                {value}px
              </span>
              <span className="text-micro text-fg-subtle">{role}</span>
            </li>
          ))}
        </ul>
        <p className="mt-md font-mono text-micro text-fg-subtle">
          Viewport: {width != null ? `${width}px` : '—'}
          {active && ` — ${active} composition`}
        </p>
      </SystemRow>

      <SystemRow label="Compositions" note="The active one is highlighted. Resize to move between them.">
        <div className="grid gap-md lg:grid-cols-3">
          {COMPOSITIONS.map((composition) => (
            <div
              key={composition.name}
              className={cn(
                'border p-lg transition-colors duration-[--duration-base]',
                active === composition.name
                  ? 'border-fg bg-bg-raised'
                  : 'border-line opacity-60'
              )}
            >
              <div className="flex items-baseline justify-between">
                <Label className="text-fg">{composition.name}</Label>
                <span className="font-mono text-micro text-fg-subtle">
                  {composition.grid}
                </span>
              </div>
              <p className="mt-2xs font-mono text-micro text-fg-subtle">
                {composition.range}
              </p>
              <ul className="mt-md flex flex-col gap-2xs">
                {composition.rules.map((rule) => (
                  <li key={rule} className="flex gap-2xs text-body-sm text-fg-muted">
                    <span aria-hidden="true" className="text-fg-subtle">
                      —
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SystemRow>
    </SystemBlock>
  );
}
