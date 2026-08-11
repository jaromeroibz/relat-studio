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
        className="pt-[calc(var(--nav-height)+var(--space-3xl))] pb-xl"
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
