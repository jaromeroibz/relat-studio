import { useMemo, useRef } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/cn.js';
import { useProjectFeatureChoreography } from '../../hooks/useProjectFeatureChoreography.js';
import { ProjectMediaReel } from './ProjectMediaReel.jsx';

const STATUS = { completed: 'Completed', 'in-progress': 'In progress' };

/** Resolves a slot's curated key list into real media objects, in order. */
function resolveReel(project, reel) {
  return reel
    .map(({ key, objectPosition }) => {
      const image = project.media[key];
      return image ? { ...image, objectPosition } : null;
    })
    .filter(Boolean);
}

/**
 * The homepage Work presentation — one consistent editorial chapter shared
 * by every featured project: quiet id/metadata, a large centered statement,
 * one large centered media reel. Deliberately the SAME shape for all three
 * projects — the earlier version gave each project its own asymmetric
 * left/right composition and a second supporting-media block, which read as
 * fragmented and left too much dead space; personality now comes from each
 * project's own imagery, statement and hover reel, not from a bespoke
 * layout per chapter.
 *
 * The media reel is the one interaction carried over unchanged
 * (ProjectMediaReel.jsx) — it already reveals more of a project on hover, so
 * a second supporting image next to it would just repeat that same material.
 *
 * @param {object} props
 * @param {import('../../data/projects.js').Project} props.project
 * @param {import('../../data/index.js').ProjectCopy} props.copy
 * @param {number} props.index Zero-based position in the index.
 * @param {import('react').ElementType} [props.titleAs='h3'] Heading level —
 *   `h3` on the homepage (which already has an `h2` for the section), `h2`
 *   on `/work` (whose own `h1` sits directly above, with no gap to leave).
 * @param {boolean} [props.leadIn] Less lead-in space before this chapter —
 *   used on the first project only, so the section reads as confident and
 *   spacious rather than empty.
 */
export function ProjectFeature({ project, copy, index, titleAs: Title = 'h3', leadIn = false }) {
  const config = FEATURE[project.slug] ?? DEFAULT_FEATURE;

  const sectionRef = useRef(null);
  const idRef = useRef(null);
  const metaRef = useRef(null);
  const mediaMaskRef = useRef(null);
  const mediaInnerRef = useRef(null);
  // Fixed at three — every configured statement is authored as exactly
  // three lines. A future project with a different line count needs one
  // more ref declared here.
  const statement0 = useRef(null);
  const statement1 = useRef(null);
  const statement2 = useRef(null);

  // A full, fixed-length array with a stable identity — never trimmed here.
  // JSX below only renders as many masks as `config` actually configures, so
  // the unused trailing refs simply stay `null`; the choreography hook
  // already drops those (`.filter(Boolean)`, inside its effect, not render).
  const statementLineRefs = useMemo(() => [statement0, statement1, statement2], []);

  useProjectFeatureChoreography(
    { sectionRef, idRef, metaRef, statementLineRefs, mediaMaskRef, mediaInnerRef },
    { shiftScale: config.shiftScale }
  );

  const meta = [copy.category, project.year, STATUS[project.status]].filter(Boolean);
  const heroImages = resolveReel(project, config.heroReel);

  return (
    <Link
      to={`/work/${project.slug}`}
      aria-label={`${copy.title} — view project`}
      ref={sectionRef}
      className={cn('project-feature block pb-2xl lg:pb-3xl', leadIn ? 'pt-lg lg:pt-xl' : 'pt-2xl lg:pt-3xl')}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-md">
        <Title
          ref={idRef}
          className="project-feature__id font-mono text-label uppercase tracking-label text-fg-subtle"
        >
          {config.label} <span className="text-fg">{copy.title}</span>
        </Title>
        <div ref={metaRef} className="flex flex-wrap gap-md font-mono text-micro uppercase tracking-label text-fg-subtle">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-xl max-w-[42rem] text-center font-display text-display-3">
        {config.statementLines.map((line, i) => (
          <span key={line} className="project-feature__statement-mask block">
            <span ref={statementLineRefs[i]} className="project-feature__statement-line">
              {line}
            </span>
          </span>
        ))}
      </p>

      <div className="mx-auto mt-xl w-full md:w-[80vw] lg:w-[72vw] lg:max-w-[68rem]">
        <ProjectMediaReel
          maskRef={mediaMaskRef}
          innerRef={mediaInnerRef}
          images={heroImages}
          aspect={config.heroAspect}
          eager={index === 0}
        />
      </div>
    </Link>
  );
}

/**
 * Per-project editorial decisions. Everything not listed here falls back to
 * `DEFAULT_FEATURE` — new featured projects work without being configured,
 * they just read as a plainer chapter until someone authors one.
 *
 * `heroReel` entries are `{ key, objectPosition? }` — `key` indexes
 * `project.media` (src/data/projects.js). The first entry is the cover: the
 * only frame shown without hover, and the only one with real alt text.
 */
const DEFAULT_FEATURE = {
  label: '',
  heroReel: [{ key: 'cover' }],
  heroAspect: '16 / 9',
  statementLines: [],
  shiftScale: 1.06,
};

const FEATURE = {
  'scotty-grand': {
    ...DEFAULT_FEATURE,
    label: '01',
    heroReel: [{ key: 'site-home' }, { key: 'portrait' }, { key: 'about' }, { key: 'site-detail' }],
    statementLines: ['An artist website', 'built around identity,', 'photography and motion.'],
  },
  'gecko-surf-house': {
    ...DEFAULT_FEATURE,
    label: '02',
    heroReel: [{ key: 'site-home' }, { key: 'rooms-index' }, { key: 'booking-calendar' }, { key: 'ui-type' }],
    statementLines: ['A hospitality experience', 'designed from discovery', 'through booking.'],
    shiftScale: 1.05,
  },
  bolaca: {
    ...DEFAULT_FEATURE,
    label: '03',
    heroReel: [{ key: 'storefront' }, { key: 'catalogue' }, { key: 'product-detail' }],
    statementLines: ['An e-commerce experience', 'built around discovery,', 'choice and purchase.'],
    shiftScale: 1.07,
  },
};
