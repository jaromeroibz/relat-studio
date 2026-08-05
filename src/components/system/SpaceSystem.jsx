import { useEffect, useRef, useState } from 'react';
import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Label } from '../ui/Label.jsx';
import { Grid } from '../layout/Grid.jsx';

const STEPS = [
  ['3xs', '--space-3xs'],
  ['2xs', '--space-2xs'],
  ['xs', '--space-xs'],
  ['sm', '--space-sm'],
  ['md', '--space-md'],
  ['lg', '--space-lg'],
  ['xl', '--space-xl'],
  ['2xl', '--space-2xl'],
  ['3xl', '--space-3xl'],
  ['4xl', '--space-4xl'],
  ['5xl', '--space-5xl'],
];

const FLUID = [
  ['section', '--space-section', 'Standard band rhythm'],
  ['section-lg', '--space-section-lg', 'Where the page should breathe'],
  ['gutter', '--gutter', 'Page margin and grid gap'],
];

const CONTAINERS = [
  ['wide', '--container-wide', 'Full-bleed compositions, image grids'],
  ['default', '--container-default', 'The standard page measure'],
  ['narrow', '--container-narrow', 'Editorial passages, case studies'],
  ['text', '--container-text', 'Running prose, held to a readable line'],
];

/** Reads a token's resolved pixel value at the current viewport. */
function TokenValue({ token }) {
  const ref = useRef(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const read = () =>
      setValue(Math.round(Number.parseFloat(getComputedStyle(element).width) * 10) / 10);

    read();
    const observer = new ResizeObserver(read);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
        style={{ width: `var(${token})` }}
      />
      <span className="font-mono text-micro tabular-nums text-fg-subtle">
        {value != null ? `${value}px` : '—'}
      </span>
    </>
  );
}

export function SpaceSystem() {
  return (
    <SystemBlock
      id="space"
      index="03"
      title="Space & measure"
      description="A 4px base for components, fluid steps for composition. Whitespace is structural here — it is the reason motion has somewhere to happen."
    >
      <SystemRow label="Fixed steps" note="Component-level spacing. Predictable at any viewport.">
        <div className="flex flex-col gap-2xs">
          {STEPS.map(([name, token]) => (
            <div key={name} className="relative flex items-center gap-md">
              <Label className="w-16 shrink-0 text-fg">{name}</Label>
              <div
                className="h-3 shrink-0 bg-accent"
                style={{ width: `var(${token})` }}
              />
              <TokenValue token={token} />
            </div>
          ))}
        </div>
      </SystemRow>

      <SystemRow label="Fluid steps" note="These respond to the viewport. Resize to watch them move.">
        <div className="flex flex-col gap-sm">
          {FLUID.map(([name, token, role]) => (
            <div key={name} className="relative flex flex-col gap-3xs">
              <div className="flex flex-wrap items-baseline gap-sm">
                <Label className="text-fg">{name}</Label>
                <TokenValue token={token} />
                <span className="text-micro text-fg-subtle">{role}</span>
              </div>
              <div
                className="h-3 max-w-full bg-fg-muted"
                style={{ width: `var(${token})` }}
              />
            </div>
          ))}
        </div>
      </SystemRow>

      <SystemRow label="Containers" note="Four widths, each with a job.">
        <div className="flex flex-col gap-sm">
          {CONTAINERS.map(([name, token, role]) => (
            <div key={name} className="relative flex flex-col gap-3xs">
              <div className="flex flex-wrap items-baseline gap-sm">
                <Label className="text-fg">{name}</Label>
                <TokenValue token={token} />
                <span className="text-micro text-fg-subtle">{role}</span>
              </div>
              <div
                className="h-8 max-w-full border border-line-strong bg-bg-raised"
                style={{ width: `var(${token})` }}
              />
            </div>
          ))}
        </div>
      </SystemRow>

      <SystemRow
        label="Grid"
        note="4 / 8 / 12 columns. The counts change at the same breakpoints as the compositions."
      >
        <Grid>
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={[
                'flex h-16 items-end justify-center border border-line bg-bg-raised pb-3xs font-mono text-micro text-fg-subtle',
                index >= 4 && index < 8 ? 'hidden md:flex' : '',
                index >= 8 ? 'hidden lg:flex' : '',
              ].join(' ')}
            >
              {index + 1}
            </div>
          ))}
        </Grid>
      </SystemRow>
    </SystemBlock>
  );
}
