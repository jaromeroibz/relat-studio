import { useEffect, useRef, useState } from 'react';
import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Label } from '../ui/Label.jsx';
import { cn } from '../../lib/cn.js';

const SCALE = [
  { token: 'display-1', class: 'text-display-1', sample: 'Relate', role: 'Hero. One per site.' },
  { token: 'display-2', class: 'text-display-2', sample: 'Selected Work', role: 'Section openers.' },
  { token: 'display-3', class: 'text-display-3', sample: 'Good digital work', role: 'Statements, project titles.' },
  { token: 'heading-1', class: 'text-heading-1', sample: 'Strategy', role: 'Primary headings.' },
  { token: 'heading-2', class: 'text-heading-2', sample: 'Creative Technology', role: 'Sub-headings.' },
  { token: 'heading-3', class: 'text-heading-3', sample: 'Understanding the business', role: 'Small headings, wordmark.' },
  { token: 'body-lg', class: 'text-body-lg font-body', sample: 'Digital experiences should create a feeling.', role: 'Lead paragraphs.' },
  { token: 'body', class: 'text-body font-body', sample: 'Before designing or developing, RELAT seeks to understand the person and the business.', role: 'Running text.' },
  { token: 'body-sm', class: 'text-body-sm font-body', sample: 'Visual systems, interaction and responsive design.', role: 'Captions, secondary text.' },
  { token: 'label', class: 'text-label font-mono uppercase', sample: 'Santa Teresa, Costa Rica', role: 'Metadata, categories.' },
  { token: 'micro', class: 'text-micro font-mono uppercase', sample: '2026 — Digital Studio', role: 'Fine print, indices.' },
];

const TYPEFACES = [
  { id: 'system', label: 'System' },
  { id: 'grotesk', label: 'Grotesk' },
  { id: 'editorial', label: 'Editorial' },
];

/** Reports the size a fluid token actually resolves to at this viewport. */
function ComputedSize({ className }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const read = () => {
      const styles = getComputedStyle(element);
      setSize({
        size: Math.round(Number.parseFloat(styles.fontSize) * 10) / 10,
        leading: Math.round(Number.parseFloat(styles.lineHeight) * 10) / 10,
      });
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={ref} className={cn('absolute opacity-0', className)} aria-hidden="true">
        M
      </span>
      <span className="font-mono text-micro tabular-nums text-fg-subtle">
        {size ? `${size.size}px / ${size.leading}px` : '—'}
      </span>
    </>
  );
}

export function TypeSystem() {
  const [typeface, setTypeface] = useState('system');

  useEffect(() => {
    document.documentElement.dataset.typeface = typeface;
    return () => {
      delete document.documentElement.dataset.typeface;
    };
  }, [typeface]);

  return (
    <SystemBlock
      id="type"
      index="02"
      title="Typography"
      description="Fluid, and deliberately font-agnostic. Every step carries its own leading and tracking, so a token sets a complete treatment rather than a size. Sizes below are measured at your current viewport — resize the window to see the scale respond."
    >
      <SystemRow
        label="Typeface swap"
        note="Phase 1 mechanism check. These are system stacks, not candidates — the real bake-off is Phase 2."
      >
        <div className="flex flex-col gap-md">
          <div className="flex flex-wrap gap-2xs">
            {TYPEFACES.map((face) => (
              <button
                key={face.id}
                type="button"
                onClick={() => setTypeface(face.id)}
                aria-pressed={typeface === face.id}
                className={cn(
                  'border px-md py-2xs font-mono text-label uppercase transition-colors duration-[--duration-fast]',
                  typeface === face.id
                    ? 'border-fg bg-fg text-bg'
                    : 'border-control-line text-fg-muted hover:border-fg hover:text-fg'
                )}
              >
                {face.label}
              </button>
            ))}
          </div>
          <p className="max-w-text text-body-sm text-fg-muted">
            Switching re-points three variables — <code className="font-mono text-micro">--font-display</code>,{' '}
            <code className="font-mono text-micro">--font-body</code>,{' '}
            <code className="font-mono text-micro">--font-mono</code> — plus any optical
            tracking that face needs. No component knows a family name, so the Phase 2
            decision costs one file.
          </p>
        </div>
      </SystemRow>

      <SystemRow label="Scale" note="11 steps. Nothing between them.">
        <div className="flex flex-col">
          {SCALE.map((step) => (
            <div
              key={step.token}
              className="relative flex flex-col gap-2xs border-b border-line py-md last:border-0"
            >
              <div className="flex flex-wrap items-baseline gap-sm">
                <Label className="text-fg">{step.token}</Label>
                <ComputedSize className={step.class} />
                <span className="text-micro text-fg-subtle">{step.role}</span>
              </div>
              <p className={cn('min-w-0 break-words', step.class)}>{step.sample}</p>
            </div>
          ))}
        </div>
      </SystemRow>

      <SystemRow
        label="Hierarchy"
        note="How the steps behave together. The jump from display to body is the point."
      >
        <div className="max-w-narrow border border-line p-lg">
          <Label>01 — Approach</Label>
          <h3 className="mt-md text-display-3">Good digital work starts with understanding.</h3>
          <p className="mt-md max-w-text text-body-lg text-fg-muted">
            Before designing or developing, RELAT seeks to understand the person, the
            business and the audience.
          </p>
          <p className="mt-md max-w-text text-body text-fg-muted">
            The result should feel considered rather than assembled. Every project is
            intentional, well designed and technically sound — the promise is not that
            every project will be experimental.
          </p>
          <p className="mt-lg font-mono text-micro uppercase text-fg-subtle">
            Santa Teresa, Costa Rica
          </p>
        </div>
      </SystemRow>
    </SystemBlock>
  );
}
