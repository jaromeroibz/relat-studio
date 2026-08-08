import { useParams } from 'react-router';
import { ProjectHeader } from '../components/work/ProjectHeader.jsx';
import { ProjectNext } from '../components/work/ProjectNext.jsx';
import { Story } from '../components/work/story/Story.jsx';
import { getContent, getProject, getNextProject } from '../data/index.js';
import NotFound from './not-found.jsx';

export const meta = ({ params }) => {
  const { site, projectCopy } = getContent();
  const copy = projectCopy[params.slug];
  if (!copy) return [{ title: `Not found — ${site.name}` }];

  return [
    { title: `${copy.title} — ${site.name}` },
    { name: 'description', content: copy.description },
    { property: 'og:title', content: `${copy.title} — ${site.name}` },
    { property: 'og:description', content: copy.description },
  ];
};

/**
 * A project story.
 *
 * The page is assembled from data: a title card, a sequence of story blocks,
 * and the handover to the next project. Nothing here is specific to any one
 * project — the atmosphere on the wrapper changes the air, and the blocks in
 * the content change the sequence.
 *
 * That is the portfolio system: to add a project you write it, not build it.
 */
export default function ProjectStory() {
  const { slug } = useParams();
  const { projectCopy } = getContent();

  const project = getProject(slug);
  const copy = projectCopy[slug];

  // A project without a story has no page yet — it lives in the index only.
  if (!project || !copy?.story) return <NotFound />;

  const next = getNextProject(slug);
  const nextCopy = next ? projectCopy[next.slug] : null;

  return (
    <div
      data-atmosphere={project.atmosphere}
      data-themed
      className="min-h-svh bg-bg text-fg"
    >
      <ProjectHeader project={project} copy={copy} />
      <Story blocks={copy.story} media={project.media} />

      {next && nextCopy && (
        <ProjectNext
          project={next}
          copy={nextCopy}
          hasStory={Boolean(projectCopy[next.slug]?.story)}
        />
      )}
    </div>
  );
}
