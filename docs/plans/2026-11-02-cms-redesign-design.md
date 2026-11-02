# Portfolio CMS redesign — design

Agreed 2026-11-02. Supersedes the "Workbench" admin shipped in `64e291c`,
which was rejected on all four axes: too dark, still forms, insufficient
coverage, confusing structure.

## Why the first attempt failed

It was built as a control panel — a filing system of forms over a dark
surface. The ask was a CMS: somewhere you see your site and change it. The
visual direction was also inferred from a three-option question rather than
from evidence. `blog.suzarilshah.uk`, which the owner designs and maintains,
is light, editorial and bold, and is the reference this design follows.

## Decisions

| Question | Decision |
| --- | --- |
| Editing model | Split view: live preview of the real site + contextual panel |
| Visual language | Match `blog.suzarilshah.uk`; one family across admin, sign-in, public |
| Blog | External blog stays the writing platform; build on top of its API |
| Media | Real library over the Blob store, with a picker |
| SEO | Full control panel, everything database-driven |
| Static content | Eliminated — seed from current defaults, then remove fallbacks |
| Order | Design → editor → coverage → SEO |

Removals approved: `CurvedScrollText.tsx`, `ParallaxBackground.tsx`, the
project snapshot feature (0 of 2 projects, `SCREENSHOT_API_KEY` unset in
production), `/debug/auth`.

## 1. Visual system

Derived from the blog, not invented.

- **Canvas** — warm off-white `#FAFAF9`, white cards, content on a large
  rounded container floating over a dark page edge.
- **Navigation** — floating dark pill. Left rail on desktop; bottom-anchored
  and thumb-reachable on mobile.
- **Type** — Inter with real range: display 40–64px at `-0.02em`, body 15px.
  JetBrains Mono *only* for metadata pills (dates, counts, status), mirroring
  the blog's "Aug 29, 2026 • Article".
- **Shape** — 16px radius on cards, 999px on pills and buttons. Depth from
  soft large-radius shadows, not borders.
- **Colour** — near-black and white carry the structure. One accent, read from
  the existing `--p-*` tokens so it follows the site's accent setting.
  Semantic colour for state only, never decoration.
- **Motion** — 150–200ms ease-out, transform and opacity only. Respects
  `prefers-reduced-motion`.

## 2. Split-view editor

The preview is the real public page in an iframe. A reimplementation would
drift from production; this cannot.

- **Live draft.** A `PreviewProvider` on the public page is inert in
  production. In preview mode it receives draft content over `postMessage` and
  overrides the server-rendered values. Nothing reaches the database until
  Publish — auto-saving would change the live site mid-thought, and reloading
  the iframe per keystroke would be unusable.
- **Click to select.** Sections already render anchor ids (`#about`,
  `#skills`, `#contact`). An overlay maps a click to the nearest id and the
  panel swaps to that section. Selecting in the panel scrolls the preview.
- **Device toggles.** Desktop / tablet / phone resize the iframe to real
  breakpoints, so mobile is checked during editing rather than after.
- **Fallback.** If the iframe fails, the panel still works standalone. Editing
  never depends on the preview succeeding.

## 3. Eliminating static content

The root cause is `{...defaults, ...content}` in every section: an empty
database field silently renders hardcoded placeholder text. This is why the
live Contact section currently publishes hardcoded email and social links, and
why Experience carries a sample "Example Company / $500K+" row.

Sequence: a migration seeds current hardcoded values into the database, row by
row, verified. Only then do components stop merging defaults. Output is
byte-identical through the change — values move from code to data.

**Keep one distinction.** "Field is empty" and "database unreachable" are
different failures. Empty renders nothing (clear a Twitter link, the icon
goes). Unreachable serves last known good content from cache. Collapsing the
two is how placeholder text reaches a live site.

New editable surfaces: navigation, footer, contact details and socials, site
identity, and the JSON-LD currently hardcoding name, job title, UniKL and the
MVP credential.

Media library lands here: browsable grid over the Blob store with usage
tracking, plus a picker on every image field.

A test asserts no public component imports a hardcoded content default, so
this cannot quietly regress.

## 4. SEO

- Identity (name, job title, location, socials, education, credentials) lives
  in the database and feeds JSON-LD, so structured data tracks content.
- Metadata gains canonical, Twitter card, locale, per-section OG images.
- Sitemap generated from genuinely visible sections, projects, and live posts
  from the blog API — replacing a fixed list containing a dead `#blog` anchor.
- Live Google / LinkedIn / X preview, with warnings for over-length titles,
  missing descriptions, and images without alt text.
- Public mobile work: type scale, touch targets, navigation, and the heavy
  Framer Motion sections that currently ignore `prefers-reduced-motion`.

## 5. Sign-in, productivity, safety

Sign-in adopts the same language: centred card on the warm canvas, the site
logo, one clear action, honest error states.

Productivity: `⌘K` command palette, keyboard save, locally autosaved drafts so
a closed tab loses nothing, duplicate-and-reorder on every list, and the
existing version history surfaced properly.

Safety: every phase ships behind CI (typecheck, lint, tests, build), with new
tests for the seed migration and the no-hardcoded-defaults rule. Each phase is
independently deployable and reviewed in a browser before pushing.

## Phases

1. **Design system + shell + sign-in**, fully responsive.
2. **Split-view live-preview editor.**
3. **Coverage** — kill static content, media library.
4. **SEO panel + public mobile polish.**

Each is deployable on its own. Building the design system first means later
phases are styled once, not twice.
