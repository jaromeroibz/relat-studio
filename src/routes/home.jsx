import { Hero } from '../components/hero/Hero.jsx';
import { SelectedWork } from '../components/work/SelectedWork.jsx';
import { Statement } from '../components/sections/Statement.jsx';
import { Capabilities } from '../components/sections/Capabilities.jsx';
import { About } from '../components/sections/About.jsx';
import { PosterCTA } from '../components/sections/PosterCTA.jsx';
import { ContactCTA } from '../components/sections/ContactCTA.jsx';
import { getContent } from '../data/index.js';
import { buildMeta, studioJsonLd } from '../lib/seo.js';

export const meta = () => {
  const { site } = getContent();
  return buildMeta({
    title: site.meta.title,
    description: site.meta.description,
    path: '/',
  });
};

/**
 * The homepage, as one sequence.
 *
 * Hero → Work → Statement → Capabilities → About → Start a Project →
 * Contact.
 *
 * Quiet, expressive, quiet: Hero and Statement give the eye somewhere to
 * rest between Work and Capabilities, and About closes the light passages
 * before the one dark invitation. The grounds carry that rhythm — light
 * opens, dark holds the work, light states the idea, light returns for
 * what the studio does and who it is, and dark closes on the one
 * invitation, which the footer sits inside so the page ends on one surface
 * rather than trailing into a strip of links.
 *
 * Motion budget, spent deliberately: the hero's exit, the Work index
 * opening, the Statement's letter-by-letter build, and About's dark
 * takeover into Start a Project. Everything else is the shared entrance.
 */
export default function Home() {
  const { startAProject } = getContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioJsonLd()) }}
      />
      <Hero />
      <SelectedWork />
      <Statement />
      <Capabilities />
      <About />
      <PosterCTA id="start-a-project" {...startAProject} />
      <ContactCTA />
    </>
  );
}
