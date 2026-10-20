import { Container } from '../../layout/Container.jsx';
import { Reveal } from '../../motion/Reveal.jsx';
import { Label } from '../../ui/Label.jsx';
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
    case 'passage':
      return <Passage block={block} />;
    case 'opening':
      return <Opening block={block} />;
    case 'stagger':
      return <Stagger block={block} media={media} tone={index} />;
    case 'handsets':
      return <Handsets block={block} media={media} tone={index} />;
    case 'chapter':
      return <Chapter block={block} media={media} />;
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

/**
 * A hairline edge, drawn inside the clip so it opens with the image. For
 * screenshots whose own ground is close to the page's — without it a cream
 * interface dissolves into a cream page and the frame is lost.
 */
const EDGE = 'project-media--edge';

/** An image's own proportion, for blocks that should never crop it. */
function imageAspect(image) {
  return image?.width && image?.height ? `${image.width} / ${image.height}` : undefined;
}

const MEDIA_WIDTH = {
  full: null, // edge to edge — no container
  wide: 'wide',
  inset: 'narrow',
};

function Media({ block, media, tone }) {
  const width = MEDIA_WIDTH[block.width ?? 'wide'];

  const frame = (key, className) => (
    <ProjectMedia
      image={media[key] ?? null}
      tone={tone}
      aspect={block.aspect ?? imageAspect(media[key])}
      fit={block.fit}
      className={cn(block.edge && EDGE, className)}
      revealOnView
      pendingLabel={block.pending ?? block.caption ?? 'Image pending'}
    />
  );

  const figure = (
    <figure className={cn(width === null && 'px-0')}>
      {/* `mobile` swaps in a crop made for phone widths. Both frames are in
        * the markup but only one is ever displayed, and a lazy image inside
        * a `display: none` frame is never fetched — so a phone loads the
        * crop alone and a desktop loads the full capture alone. */}
      {block.mobile ? (
        <>
          {frame(block.mobile, 'md:hidden')}
          {frame(block.media, 'max-md:hidden')}
        </>
      ) : (
        frame(block.media)
      )}
      {block.caption && (
        <figcaption className="mt-2xs px-gutter font-mono text-micro uppercase tracking-label text-fg-subtle lg:px-0">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );

  if (width === null) {
    return <section className="py-lg">{figure}</section>;
  }

  return (
    <section className="py-lg">
      <Container width={width}>{figure}</Container>
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

/**
 * A short passage of reading, set in the story's own rhythm.
 *
 * The one block that carries plain prose: an optional mono label and a heading
 * on the left, the paragraphs on the right from `lg` up, stacked below it. The
 * heading is a real `h2` (the page has one `h1` — the project title), set
 * smaller than a `statement` on purpose, so statements stay the large
 * typographic moments and a passage reads as context around them. Without a
 * heading the paragraphs sit alone in the right-hand column with no top
 * padding, tucked up under whatever block precedes them as its continuation.
 */
function Passage({ block }) {
  const { label, heading, body, variant } = block;
  // `display`: the heading is set as a statement across the full measure and
  // the prose drops beneath it, indented — a passage that opens a chapter
  // rather than annotating one.
  const display = variant === 'display';

  return (
    <section className={heading ? 'py-2xl lg:py-3xl' : 'pb-2xl lg:pb-3xl'}>
      <Container width="wide">
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          {heading && (
            <Reveal className={cn('col-span-4 md:col-span-8', display ? 'lg:col-span-9' : 'lg:col-span-5')}>
              {label && <Label className="block">{label}</Label>}
              <h2
                className={cn(
                  display
                    ? 'max-w-[18ch] font-display text-display-3'
                    : 'max-w-narrow font-display text-heading-1',
                  label && 'mt-md'
                )}
              >
                {heading}
              </h2>
            </Reveal>
          )}
          <Reveal
            delay={60}
            className={cn(
              'col-span-4 flex flex-col gap-md md:col-span-6',
              display ? 'lg:col-span-5 lg:col-start-6' : 'lg:col-span-6 lg:col-start-7',
              heading && (display ? 'mt-lg lg:mt-xl' : 'mt-lg lg:mt-0')
            )}
          >
            {body.map((paragraph) => (
              <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * The project's opening: its line, set large, with a short introduction at the
 * foot of it. Typography first, before any image — the same move the homepage
 * hero makes, one step quieter.
 */
function Opening({ block }) {
  return (
    <section className="py-2xl lg:py-3xl">
      <Container width="wide">
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
            <p className="max-w-[18ch] font-display text-display-3">{block.statement}</p>
          </Reveal>
          <Reveal
            delay={80}
            className="col-span-4 mt-lg md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end"
          >
            <p className="max-w-text text-body-lg text-fg-muted">{block.intro}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * Two screens, set on a diagonal rather than side by side.
 *
 * Each placement is a `[start, span]` pair on the twelve-column grid, read
 * from `lg` up. Below it the pair stacks and the second is pulled to the
 * opposite edge, so the offset survives on a phone instead of collapsing into
 * a column of equal rectangles. `desktopOnly` lists keys withheld below `md`.
 * Every image keeps its own proportion — these
 * are interfaces, and a crop is a lie about them.
 */
function Stagger({ block, media, tone }) {
  const edge = block.edge ? EDGE : undefined;

  return (
    <section className="py-lg">
      <Container width="wide">
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-12 lg:gap-y-xl">
          {block.media.map((key, i) => {
            const [start, span] = block.placement[i];
            return (
              <div
                key={key}
                className={cn(
                  'stagger-item',
                  i === 1 && 'ml-auto w-[88%] md:w-[80%] lg:ml-0 lg:w-auto',
                  // A desktop interface set at phone width is a thumbnail, and
                  // a thumbnail of a list proves nothing. Where the same ground
                  // is already shown on a phone screen, the desktop frame waits
                  // for a width it can be read at.
                  block.desktopOnly?.includes(key) && 'hidden md:block'
                )}
                style={{ '--stagger': `${start} / span ${span}` }}
              >
                <ProjectMedia
                  image={media[key] ?? null}
                  tone={tone + i}
                  aspect={block.aspect ?? imageAspect(media[key])}
                  className={edge}
                  revealOnView
                  pendingLabel="Screen pending"
                />
              </div>
            );
          })}
        </div>
        {block.caption && <Caption>{block.caption}</Caption>}
      </Container>
    </section>
  );
}

/**
 * A passage beside a pair of phone screens.
 *
 * Phone screenshots are tall and narrow; set beside prose they give the text a
 * counterweight instead of a gallery. The second screen sits lower on `lg`+. On
 * a phone the two stack at a width a phone can actually read, alternating
 * edges so the column has a rhythm.
 */
function Handsets({ block, media, tone }) {
  const { heading, body, screens } = block;

  return (
    <section className="py-2xl lg:py-3xl">
      <Container width="wide">
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <Reveal>
              <h2 className="max-w-narrow font-display text-heading-1">{heading}</h2>
            </Reveal>
            <Reveal delay={60} className="mt-lg flex flex-col gap-md">
              {body.map((paragraph) => (
                <p key={paragraph} className="max-w-text text-body-lg text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

          <div className="col-span-4 mt-2xl grid grid-cols-1 gap-xl md:col-span-8 md:w-full md:max-w-[38rem] md:justify-self-center md:grid-cols-2 md:gap-lg lg:col-span-6 lg:col-start-7 lg:mt-0 lg:max-w-none lg:justify-self-stretch lg:gap-gutter">
            {screens.map((key, i) => (
              <div
                key={key}
                className={cn(
                  'w-[78%] md:mx-0 md:w-auto',
                  i === 0 ? 'mr-auto' : 'ml-auto md:mt-2xl lg:mt-3xl'
                )}
              >
                <ProjectMedia
                  image={media[key] ?? null}
                  tone={tone + i}
                  aspect={imageAspect(media[key])}
                  className={EDGE}
                  revealOnView
                  pendingLabel="Screen pending"
                />
              </div>
            ))}
            {block.caption && (
              <Caption className="mt-0 md:col-span-2">{block.caption}</Caption>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * A run of blocks on a ground of its own.
 *
 * The page stays on its one atmosphere; a chapter is the single place it is
 * allowed to turn dark, because the scenes inside it are night scenes and read
 * best on a night ground. The theme is local to the subtree (`isolated`, as in
 * Section) — it never reaches ThemeController, so the document does not
 * cross-fade around it.
 */
function Chapter({ block, media }) {
  return (
    <div data-theme="dark" data-themed="" className="story-chapter bg-bg py-lg text-fg">
      <Story blocks={block.blocks} media={media} />
    </div>
  );
}

/** A mono caption under a composed set of screens. */
function Caption({ className, children }) {
  return (
    <p className={cn('mt-2xs font-mono text-micro uppercase tracking-label text-fg-subtle', className)}>
      {children}
    </p>
  );
}
