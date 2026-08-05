import { Container } from '../layout/Container.jsx';
import { Label } from '../ui/Label.jsx';

/**
 * A reviewable block on the system page.
 *
 * The system page is a working document, not a designed page — it is laid out
 * for judgement, not for persuasion.
 */
export function SystemBlock({ id, index, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-2xl border-t border-line py-2xl">
      <Container width="wide">
        <header className="mb-xl flex flex-col gap-2xs md:flex-row md:items-baseline md:gap-lg">
          <Label className="shrink-0 tabular-nums">{index}</Label>
          <div className="flex flex-col gap-2xs">
            <h2 className="text-heading-1">{title}</h2>
            {description && (
              <p className="max-w-text text-body-sm text-fg-muted">{description}</p>
            )}
          </div>
        </header>
        {children}
      </Container>
    </section>
  );
}

/** A labelled sub-group inside a block. */
export function SystemRow({ label, note, children }) {
  return (
    <div className="grid gap-md border-t border-line py-lg lg:grid-cols-[14rem_1fr] lg:gap-lg">
      <div className="flex flex-col gap-3xs">
        <Label className="text-fg">{label}</Label>
        {note && <span className="text-micro text-fg-subtle">{note}</span>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
