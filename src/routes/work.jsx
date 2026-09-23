import { Container } from '../components/layout/Container.jsx';
import { Label } from '../components/ui/Label.jsx';
import { SelectedWork } from '../components/work/SelectedWork.jsx';
import { getContent } from '../data/index.js';
import { buildMeta } from '../lib/seo.js';

export const meta = () => {
  const { site } = getContent();
  return buildMeta({
    title: 'Work',
    description: `Selected work from ${site.name} — web design and development for independent businesses in Costa Rica and beyond.`,
    path: '/work',
  });
};

export default function Work() {
  return (
    <>
      <header
        data-section-theme="light"
        // `pb-0` below `lg`: `SelectedWork` right after already opens with its
        // own top padding (`space="base"`), plus the first project's own
        // `leadIn` padding on top of that — this header's own bottom padding
        // used to stack a third, fixed (non-fluid) gap on top of both,
        // totalling well over 100px of empty space before "01" on a phone.
        // Kept at `lg`+, where the combined gap reads as intended pacing
        // rather than a dead pause.
        className="pt-[calc(var(--nav-height)+var(--space-3xl))] pb-0 lg:pb-xl"
      >
        <Container width="wide">
          <Label>Work</Label>
          <h1 className="mt-md max-w-narrow text-display-2">Selected work.</h1>
        </Container>
      </header>

      <SelectedWork heading={false} space="base" />
    </>
  );
}
