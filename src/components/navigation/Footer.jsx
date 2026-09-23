import { useLocation } from 'react-router';
import { cn } from '../../lib/cn.js';
import { Container } from '../layout/Container.jsx';
import { Label } from '../ui/Label.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { getContent } from '../../data/index.js';

/**
 * Footer. Quiet by design — the contact section above it does the persuading.
 *
 * The homepage's persistent signature (Hero.jsx) sits fixed at the very
 * bottom of the viewport, which is also where the footer's own nav links
 * land once the page is scrolled all the way down — the one place the
 * signature's `pointer-events: none` isn't enough on its own, since the
 * two would visually overlap even though the link stays clickable. Local
 * clearance, only on the route where the signature exists, rather than
 * extra bottom padding everywhere.
 */
export function Footer() {
  const { site, primaryNav } = getContent();
  const year = new Date().getFullYear();
  const isHome = useLocation().pathname === '/';

  return (
    <footer
      className={cn('border-t border-line py-2xl', isHome && 'pb-[clamp(4rem,9vw,6.5rem)]')}
      data-themed
    >
      <Container>
        <div className="flex flex-col gap-xl md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2xs">
            <span className="font-display text-heading-2 uppercase tracking-wide">
              {site.name}
            </span>
            <Label>{site.location}</Label>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-lg">
            {primaryNav.map((item) => (
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
