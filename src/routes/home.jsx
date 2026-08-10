import { Hero } from '../components/hero/Hero.jsx';
import { SelectedWork } from '../components/work/SelectedWork.jsx';
import { Capabilities } from '../components/sections/Capabilities.jsx';
import { Approach } from '../components/sections/Approach.jsx';
import { About } from '../components/sections/About.jsx';
import { ContactCTA } from '../components/sections/ContactCTA.jsx';
import { getContent } from '../data/index.js';

export const meta = () => {
  const { site } = getContent();
  return [
    { title: site.meta.title },
    { name: 'description', content: site.meta.description },
    { property: 'og:title', content: site.meta.title },
    { property: 'og:description', content: site.meta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: site.url },
  ];
};

/**
 * The homepage, as one sequence.
 *
 * Hero → Work → Capabilities → Approach → About → Contact.
 *
 * The grounds carry the narrative: light opens, dark holds the work, light
 * returns for what the studio does, warm for what it believes, light for who
 * it is, and dark closes on the invitation — which the footer sits inside, so
 * the page ends on one surface rather than trailing off into a strip of links.
 *
 * Motion budget, spent deliberately: the hero's exit, the Work index opening,
 * and the line reveal used three times — hero, approach, contact. Everything
 * else is the shared entrance.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Capabilities />
      <Approach />
      <About />
      <ContactCTA />
    </>
  );
}
