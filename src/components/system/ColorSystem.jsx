import { useEffect, useRef, useState } from 'react';
import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Label } from '../ui/Label.jsx';
import { measureContrast, wcagLevel } from '../../lib/contrast.js';
import { cn } from '../../lib/cn.js';

const RAW_PALETTE = [
  {
    name: 'Ink',
    note: 'Warm near-blacks. There is no pure black in the system.',
    steps: ['--ink-900', '--ink-800', '--ink-700', '--ink-600', '--ink-500', '--ink-400', '--ink-300', '--ink-200'],
  },
  {
    name: 'Paper',
    note: 'Warm off-whites. There is no pure white either.',
    steps: ['--paper-50', '--paper-100', '--paper-200', '--paper-300'],
  },
  {
    name: 'Warm',
    note: 'The third ground. Carries the light motif without a gradient.',
    steps: ['--warm-50', '--warm-100', '--warm-200', '--warm-300'],
  },
  {
    name: 'Ember',
    note: 'The sun reduced to one accent — atmosphere, not a logo.',
    steps: ['--ember-700', '--ember-600', '--ember-500', '--ember-400', '--ember-300', '--ember-200'],
  },
];

const THEMES = ['light', 'dark', 'warm'];

/** Pairings that must hold in every theme. */
const PAIRINGS = [
  { fg: '--fg', bg: '--bg', label: 'Body text', large: false },
  { fg: '--fg-muted', bg: '--bg', label: 'Muted text', large: false },
  { fg: '--fg-subtle', bg: '--bg', label: 'Subtle text', large: false },
  { fg: '--accent', bg: '--bg', label: 'Accent text', large: false },
  { fg: '--fg', bg: '--bg-raised', label: 'Text on raised', large: false },
  { fg: '--control-line', bg: '--bg', label: 'Control boundary', nonText: true },
  { fg: '--line-strong', bg: '--bg', label: 'Divider', decorative: true },
];

function Swatch({ token }) {
  const ref = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!ref.current) return;
    const resolved = getComputedStyle(ref.current).backgroundColor;
    setValue(resolved);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-3xs">
      <div
        ref={ref}
        className="h-16 w-full border border-line"
        style={{ backgroundColor: `var(${token})` }}
      />
      <span className="truncate font-mono text-micro text-fg-muted">
        {token.replace('--', '')}
      </span>
      <span className="truncate font-mono text-micro text-fg-subtle">{value}</span>
    </div>
  );
}

/**
 * Measures every semantic pairing inside a live theme and reports the ratio.
 * Nothing here is hardcoded — if a token changes, this table changes with it.
 */
function ContrastTable({ theme }) {
  const ref = useRef(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setRows(
      PAIRINGS.map((pairing) => {
        const result = measureContrast(element, pairing.fg, pairing.bg);
        return {
          ...pairing,
          ratio: result?.ratio ?? null,
          level: result
            ? wcagLevel(result.ratio, {
                large: pairing.large,
                nonText: pairing.nonText,
                decorative: pairing.decorative,
              })
            : null,
        };
      })
    );
  }, [theme]);

  return (
    <div
      ref={ref}
      data-theme={theme}
      data-themed
      className="bg-bg p-lg text-fg"
    >
      <div className="mb-md flex items-baseline justify-between">
        <Label className="text-fg">{theme}</Label>
        <span className="font-mono text-micro text-fg-subtle">measured live</span>
      </div>

      <table className="w-full border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="py-2xs font-mono text-micro font-normal uppercase tracking-label text-fg-subtle">
              Pairing
            </th>
            <th className="py-2xs text-right font-mono text-micro font-normal uppercase tracking-label text-fg-subtle">
              Ratio
            </th>
            <th className="py-2xs text-right font-mono text-micro font-normal uppercase tracking-label text-fg-subtle">
              WCAG
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-0">
              <td className="py-2xs">
                <span style={{ color: `var(${row.fg})` }}>{row.label}</span>
              </td>
              <td className="py-2xs text-right font-mono tabular-nums">
                {row.ratio ? `${row.ratio.toFixed(2)}:1` : '—'}
              </td>
              <td
                className={cn(
                  'py-2xs text-right font-mono text-micro uppercase tracking-label',
                  row.level === 'Fail' ? 'text-accent' : 'text-fg-muted'
                )}
              >
                {row.level ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ColorSystem() {
  return (
    <SystemBlock
      id="color"
      index="04"
      title="Colour"
      description="A raw palette that components never touch, and a semantic layer they read exclusively. Every neutral is warm — that is what keeps the site from reading as generic tech."
    >
      {RAW_PALETTE.map((group) => (
        <SystemRow key={group.name} label={group.name} note={group.note}>
          <div className="grid grid-cols-2 gap-sm sm:grid-cols-4 lg:grid-cols-8">
            {group.steps.map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </div>
        </SystemRow>
      ))}

      <SystemRow
        label="Semantic tokens"
        note="Re-mapped per theme. Components only ever use these."
      >
        <div className="grid gap-md lg:grid-cols-3">
          {THEMES.map((theme) => (
            <div key={theme} data-theme={theme} data-themed className="bg-bg p-lg">
              <Label className="text-fg">{theme}</Label>
              <div className="mt-md flex flex-col gap-2xs">
                {['--bg', '--bg-raised', '--bg-sunken', '--fg', '--fg-muted', '--fg-subtle', '--accent', '--control-line', '--line-strong'].map(
                  (token) => (
                    <div key={token} className="flex items-center gap-2xs">
                      <span
                        className="h-5 w-5 shrink-0 border border-line"
                        style={{ backgroundColor: `var(${token})` }}
                      />
                      <span className="font-mono text-micro text-fg-muted">
                        {token.replace('--', '')}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </SystemRow>

      <SystemRow
        label="Contrast audit"
        note="Computed in the browser, not asserted. Anything reading Fail is a bug."
      >
        <div className="grid gap-md lg:grid-cols-3">
          {THEMES.map((theme) => (
            <ContrastTable key={theme} theme={theme} />
          ))}
        </div>
      </SystemRow>
    </SystemBlock>
  );
}
