import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Label } from '../ui/Label.jsx';

const RADII = [
  ['none', '--radius-none', 'The default. Surfaces, images, buttons, inputs.'],
  ['xs', '--radius-xs', 'Focus rings only, so the ring follows small controls.'],
  ['sm', '--radius-sm', 'Reserved. Use requires a reason.'],
  ['full', '--radius-full', 'Circular forms only — cursor, dots, the light motif.'],
];

export function ShapeSystem() {
  return (
    <SystemBlock
      id="shape"
      index="05"
      title="Shape"
      description="The default radius is zero. Rounding is an exception that has to earn its place — a page of soft rectangles is the single fastest way to look like a template."
    >
      <SystemRow label="Radius" note="Four values. Three of them are rare.">
        <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
          {RADII.map(([name, token, role]) => (
            <div key={name} className="flex flex-col gap-2xs">
              <div
                className="h-24 w-full border border-line-strong bg-bg-raised"
                style={{ borderRadius: `var(${token})` }}
              />
              <Label className="text-fg">{name}</Label>
              <span className="text-micro text-fg-subtle">{role}</span>
            </div>
          ))}
        </div>
      </SystemRow>

      <SystemRow
        label="Edges"
        note="Rules and borders carry the structure that radius usually would."
      >
        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-3xs">
            <div className="h-px w-full bg-line" />
            <span className="font-mono text-micro text-fg-subtle">
              line — structural divisions, low contrast
            </span>
          </div>
          <div className="flex flex-col gap-3xs">
            <div className="h-px w-full bg-line-strong" />
            <span className="font-mono text-micro text-fg-subtle">
              line-strong — deliberate separation, control outlines
            </span>
          </div>
          <div className="flex flex-col gap-3xs">
            <div className="h-px w-full bg-fg" />
            <span className="font-mono text-micro text-fg-subtle">
              fg — emphasis. Rare.
            </span>
          </div>
        </div>
      </SystemRow>
    </SystemBlock>
  );
}
