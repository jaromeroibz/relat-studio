# Content

All copy lives here. Components receive it as props and never contain sentences
of their own. Two reasons: the site ships in English but must accept Spanish
without a rebuild, and copy should be editable without reading JSX.

## Structure

```
data/
├── index.js       getContent(locale) — the only entry point components use
├── locales.js     which locales have a complete bundle
├── projects.js    locale-neutral project facts (dates, roles, media, credits)
└── en/            English copy
    ├── site.js
    ├── navigation.js
    ├── services.js
    ├── approach.js
    └── projects.js   case-study copy, keyed by slug
```

## Adding Spanish

1. Copy `en/` to `es/` and translate.
2. Add `'es'` to `SUPPORTED_LOCALES` in `locales.js`.
3. Add an `es` key to `BUNDLES` in `index.js`.
4. Add the locale to routing and to `prerender` in `react-router.config.js`.

No component changes. That is the point of the indirection.

## Rules

**Facts are never translated.** Years, roles, credits and image dimensions live
in `projects.js` so two languages can't disagree about them.

**Never invent content.** No fictional clients, testimonials, metrics or
results — see `docs/E-brand-constitution.md` and the header of `projects.js`.
Work completed before RELAT existed is welcome as Selected Work, but must carry
`attribution: 'prior-work'` so the interface states it plainly.

**Copy stays short.** If a description needs a second sentence, the design
probably needs a second look first.
