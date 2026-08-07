import { Container } from '../components/layout/Container.jsx';
import { Label } from '../components/ui/Label.jsx';
import { SelectedWork } from '../components/work/SelectedWork.jsx';
import { getContent } from '../data/index.js';

export const meta = () => {
  const { site } = getContent();
  return [
    { title: `Work — ${site.name}` },
    {
      name: 'description',
      content: `Selected work from ${site.name}, a digital studio in ${site.location}.`,
    },
  ];
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
