import { Container } from '../components/layout/Container.jsx';
import { Section } from '../components/layout/Section.jsx';
import { Label } from '../components/ui/Label.jsx';
import { TextLink } from '../components/ui/TextLink.jsx';

export const meta = () => [
  { title: 'Not found — RELAT' },
  { name: 'robots', content: 'noindex' },
];

export default function NotFound() {
  return (
    <Section theme="light" space="lg" className="flex min-h-svh items-center">
      <Container width="narrow">
        <Label>404</Label>
        <h1 className="mt-md text-display-3">Not here yet</h1>
        <p className="mt-md max-w-text text-body-lg text-fg-muted">
          This page does not exist, or has not been built yet.
        </p>
        <TextLink to="/" className="mt-xl inline-block font-mono text-label uppercase">
          Back to the studio
        </TextLink>
      </Container>
    </Section>
  );
}
