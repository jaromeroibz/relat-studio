import { Container } from '../../layout/Container.jsx';
import { Reveal } from '../../motion/Reveal.jsx';
import { ProjectMedia } from '../ProjectMedia.jsx';
import { cn } from '../../../lib/cn.js';

/**
 * The portfolio story system.
 *
 * A project story is a sequence of typed blocks rather than a page layout.
 * Every block inherits the site's typography, spacing, reveal and clip-open
 * language, so a new project is *written* — add blocks to the data and the
 * composition follows.
 *
 * The blocks are co-located because they share one contract and are never used
 * apart. Adding a type means adding a case here and a line to the docblock in
 * src/data/en/projects.js.
 *
 * @param {object} props
 * @param {import('../../../data/en/projects.js').StoryBlock[]} props.blocks
 * @param {Record<string, import('../../../data/projects.js').ProjectImage|null>} props.media
 */
export function Story({ blocks = [], media = {} }) {
  return (
    <div>
      {blocks.map((block, index) => (
        <StoryBlock key={index} block={block} media={media} index={index} />
      ))}
    </div>
  );
}

function StoryBlock({ block, media, index }) {
  switch (block.type) {
    case 'statement':
      return <Statement text={block.text} />;
    case 'media':
      return <Media block={block} media={media} tone={index} />;
    case 'pair':
      return <Pair block={block} media={media} tone={index} />;
    case 'palette':
      return <Palette block={block} />;
    case 'screens':
      return <Screens block={block} media={media} tone={index} />;
    case 'note':
      return <Note text={block.text} />;
    default:
      return null;
  }
}

/**
 * One idea, set large, with room around it. Typography as image — this is the
 * block that does the storytelling, so it is allowed the most space on the
 * page and the fewest words on the line.
 */
function Statement({ text }) {
  return (
    <section className="py-section">
      <Container width="wide">
        <Reveal>
          <p className="max-w-narrow font-display text-display-3">{text}</p>
        </Reveal>
      </Container>
    </section>
  );
}

const MEDIA_WIDTH = {
  full: null, // edge to edge — no container
  wide: 'wide',
  inset: 'narrow',
};

function Media({ block, media, tone }) {
  const width = MEDIA_WIDTH[block.width ?? 'wide'];

  const frame = (
    <figure className={cn(width === null && 'px-0')}>
      <ProjectMedia
        image={media[block.media] ?? null}
        tone={tone}
        aspect={block.aspect}
        fit={block.fit}
        revealOnView
        pendingLabel={block.pending ?? block.caption ?? 'Image pending'}
      />
      {block.caption && (
        <figcaption className="mt-2xs px-gutter font-mono text-micro uppercase tracking-label text-fg-subtle lg:px-0">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );

  if (width === null) {
    return <section className="py-lg">{frame}</section>;
  }

  return (
    <section className="py-lg">
      <Container width={width}>{frame}</Container>
    </section>
  );
}

/**
 * Two images with a vertical offset. The offset is the point — a pair set
 * level reads as a grid, and a grid is what this system exists to avoid.
 */
/**
 * A project's own palette and typefaces, shown as content rather than as a
 * specification.
 *
 * Deliberately not a brand-guidelines page: one band of colour, the values in
 * mono beneath it, and the typefaces named with their roles. The point is to
 * show what the project is made of, in RELAT's typography — a project's
 * typefaces are demonstrated by its interface, not by a specimen we would have
 * to load three extra families to fake.
 */
function Palette({ block }) {
  return (
    <section className="py-section">
      <Container width="wide">
        <Reveal>
          <div className="flex flex-col gap-lg">
            <div className="flex h-32 w-full overflow-hidden md:h-48">
              {block.colors.map((color) => (
                <div
                  key={color.value}
                  className="flex-1"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>

            <ul className="grid grid-cols-2 gap-md sm:grid-cols-4 lg:grid-cols-8">
              {block.colors.map((color) => (
                <li key={color.value} className="flex flex-col gap-3xs">
                  <span className="text-body-sm">{color.name}</span>
                  <span className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                    {color.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {block.typefaces && (
          <Reveal delay={90}>
            <ul className="mt-2xl grid gap-md border-t border-line pt-md sm:grid-cols-2 lg:grid-cols-4">
              {block.typefaces.map((face) => (
                <li key={face.name} className="flex flex-col gap-3xs">
                  <span className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                    {face.role}
                  </span>
                  <span className="text-heading-3">{face.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

/**
 * A set of screens on a shared ground.
 *
 * Side by side from `md` up; stacked below it. A row of phone-width screens
 * compressed into a phone-width column is unreadable, and readability is the
 * only reason this block exists — so the layout changes rather than the
 * screens shrinking.
 *
 * The ground is a real background rather than baked into an image, which is
 * what allows the arrangement to change at all. No device frames: the
 * interfaces are the subject.
 */
function Screens({ block, media, tone }) {
  return (
    <section className="py-lg">
      <Container width="wide">
        <div
          className="px-gutter py-2xl md:px-2xl"
          style={block.ground ? { backgroundColor: block.ground } : undefined}
        >
          <div className="mx-auto grid max-w-[22rem] grid-cols-1 gap-2xl md:max-w-none md:grid-cols-3 md:gap-lg">
            {block.media.map((key, i) => (
              <ProjectMedia
                key={key}
                image={media[key] ?? null}
                tone={tone + i}
                aspect={block.aspect}
                revealOnView
                pendingLabel="Screen pending"
              />
            ))}
          </div>
        </div>

        {block.caption && (
          <p className="mt-2xs font-mono text-micro uppercase tracking-label text-fg-subtle">
            {block.caption}
          </p>
        )}
      </Container>
    </section>
  );
}

function Pair({ block, media, tone }) {
  const [first, second] = block.media;

  return (
    <section className="py-lg">
      <Container width="wide">
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 md:items-start">
          <ProjectMedia
            image={media[first] ?? null}
            tone={tone}
            aspect={block.aspect}
            revealOnView
            pendingLabel={block.pending?.[0] ?? 'Image pending'}
          />
          <ProjectMedia
            image={media[second] ?? null}
            tone={tone + 1}
            aspect={block.aspect}
            revealOnView
            pendingLabel={block.pending?.[1] ?? 'Image pending'}
            className="md:mt-3xl"
          />
        </div>
      </Container>
    </section>
  );
}

/**
 * A small observation, set in mono against whitespace. Never a paragraph —
 * if a note needs a second sentence it is probably a statement instead.
 */
function Note({ text }) {
  return (
    <section className="py-2xl">
      <Container width="wide">
        <Reveal>
          <p className="max-w-text font-mono text-label uppercase tracking-label text-fg-muted">
            {text}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
