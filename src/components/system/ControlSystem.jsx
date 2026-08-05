import { SystemBlock, SystemRow } from './SystemBlock.jsx';
import { Button } from '../ui/Button.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { Label } from '../ui/Label.jsx';

export function ControlSystem() {
  return (
    <SystemBlock
      id="controls"
      index="06"
      title="Controls & states"
      description="Everything here is live. Hover it, tab through it, and check that focus is always visible and never removed."
    >
      <SystemRow label="Buttons" note="Three variants. There should not be a fourth.">
        <div className="flex flex-col gap-lg">
          <div className="flex flex-wrap items-center gap-md">
            <Button variant="primary">Start a conversation</Button>
            <Button variant="secondary">View work</Button>
            <Button variant="ghost">Read more</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-md">
            <Button variant="primary" size="lg">
              Large primary
            </Button>
            <Button variant="secondary" size="lg">
              Large secondary
            </Button>
          </div>
        </div>
      </SystemRow>

      <SystemRow
        label="Links"
        note="The underline is drawn left-to-right on entry and retracts right on exit. Direction is the detail."
      >
        <div className="flex flex-col gap-md">
          <p className="max-w-text text-body">
            RELAT is a digital studio in{' '}
            <TextLink to="/system" className="text-accent">
              Santa Teresa
            </TextLink>
            , Costa Rica. You can{' '}
            <TextLink to="/system">see the work</TextLink> or{' '}
            <TextLink href="mailto:hello@relat.studio">start a conversation</TextLink>.
          </p>
          <div className="flex flex-wrap gap-lg">
            <TextLink to="/system" className="font-mono text-label uppercase">
              Nav-weight link
            </TextLink>
            <TextLink
              to="/system"
              aria-current="page"
              className="font-mono text-label uppercase"
            >
              Current page
            </TextLink>
          </div>
        </div>
      </SystemRow>

      <SystemRow
        label="Focus"
        note="Two-pixel ring, three-pixel offset, current theme's focus colour. Tab into these."
      >
        <div className="flex flex-wrap items-center gap-md">
          <Button variant="secondary">Tab to me</Button>
          <TextLink to="/system">Then to me</TextLink>
          <input
            type="text"
            placeholder="And into this field"
            className="border border-control-line bg-transparent px-md py-2xs text-body-sm placeholder:text-fg-subtle"
          />
        </div>
      </SystemRow>

      <SystemRow
        label="Hover isolation"
        note="The Instrument reference: the group recedes, the target returns. Desktop pointer only."
      >
        <ul className="isolate-group flex flex-col border-t border-line">
          {['Strategy', 'Web Design', 'Development', 'Digital Experiences', 'Creative Technology'].map(
            (item, index) => (
              <li
                key={item}
                className="isolate-item flex items-baseline justify-between border-b border-line py-md"
              >
                <span className="text-heading-2">{item}</span>
                <Label className="tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </Label>
              </li>
            )
          )}
        </ul>
      </SystemRow>
    </SystemBlock>
  );
}
