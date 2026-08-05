import { Container } from '../layout/Container.jsx';
import { Label } from '../ui/Label.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { getContent } from '../../data/index.js';

/**
 * Footer. Quiet by design — the contact section above it does the persuading.
 */
export function Footer() {
  const { site, footerNav } = getContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-2xl" data-themed>
      <Container>
        <div className="flex flex-col gap-xl md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2xs">
            <span className="font-display text-heading-2 uppercase tracking-wide">
              {site.name}
            </span>
            <Label>{site.location}</Label>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-lg">
            {footerNav.studio.map((item) => (
              <TextLink
                key={item.to}
                to={item.to}
                className="font-mono text-label uppercase text-fg-muted"
              >
                {item.label}
              </TextLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2xs md:items-end">
            <TextLink
              href={`mailto:${site.contact.email}`}
              className="font-mono text-label uppercase"
            >
              {site.contact.email}
            </TextLink>
            <Label className="text-fg-subtle">
              © {year} {site.name}
            </Label>
          </div>
        </div>
      </Container>
    </footer>
  );
}
