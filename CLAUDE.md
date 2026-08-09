# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Read `AGENTS.md` first.** It holds the house rules — the non-negotiable standards (contrast, layout
shift, keyboard/ARIA ownership, tokens), the comment and prose style, and the table of generated files
that must never be hand-edited. This file covers commands and architecture; it does not repeat them.

`README.md` is the untouched `sv` scaffold boilerplate and describes nothing specific to this project.
Ignore it.

## Commands

```sh
pnpm dev                       # dev server on :5173
pnpm check                     # svelte-check — must report 0 errors
pnpm build                     # prerenders every route; catches registry 404s
pnpm lint                      # prettier --check && eslint
pnpm format                    # prettier --write

pnpm test                      # vitest run (all three projects) then playwright
npx vitest run                 # unit + component only
npx vitest run --project cli   # one project: cli | server | client
npx vitest run cli/lib.test.js # one file
npx vitest run -t 'roving'     # tests matching a name
npx playwright test            # e2e; builds and previews on :4173 itself

pnpm check:versions            # package.json pins vs registry/versions.ts
pnpm changelog                 # regenerate CHANGELOG.md
pnpm agents                    # regenerate AGENTS.md block and .claude/skills/
pnpm cli:publish               # npm publish ./cli
```

`pnpm lint` passes and should stay that way. Two things to know if it starts failing:

- **`svelte-ignore` takes rule codes, nothing else.** Svelte reads every whitespace-separated word
  after the directive as another rule name, so an explanation written inside the comment becomes a
  list of rules that do not exist — that alone accounted for 103 errors once. Put the reasoning in a
  comment above and leave the directive on its own line.
- **`<\/script>` inside a template literal in a `.svelte` file is required, not a useless escape.**
  Unescaped, the parser ends the component's own script block there. The two samples on the
  get-started page carry a scoped `eslint-disable` for this.

`svelte/no-navigation-without-resolve` is off, with the reasoning in `eslint.config.js`: this app has
no base path, and the rule is unsatisfiable in `Button`/`Badge`/`SidebarMenuButton`, which take `href`
as a pass-through prop and cannot resolve a route they were never told.

## The three things this repository is

One SvelteKit app serves all three, which is the point — none of them can drift from the others.

1. **The library** — `src/lib/components/ui/`. Components users copy into their own projects.
2. **The docs site** — `src/routes/(site)/`, plus full example apps under `src/routes/examples/*/app/`.
3. **The CLI** — `cli/`. Zero-dependency plain Node, published separately via `cli/package.json`.
   The root package is `private` and is never published.

## Everything derives from one source

The recurring failure mode here is a fact written in two places. Before adding one, look for the
generator that should be deriving it.

- **`src/lib/data/components.ts`** is the component roster. Adding a component means adding a row
  here with `built: true`; the home page grid, the docs sidebar, the roadmap counts and the registry
  index all read from it.
- **`src/lib/docs/registry.ts`** holds per-component API tables, notes and the list of examples.
- **`src/lib/docs/examples/<slug>/<id>.svelte`** are real components. Each is imported twice — once
  rendered, once as raw text — so the code shown and the thing rendered cannot disagree.
- **`src/lib/registry/build.ts`** generates `/r/*.json` at build time from the same component sources
  the site renders, by scanning imports.
- **`src/lib/registry/versions.ts`** is the only place a dependency version is written.
  `pnpm check:versions` enforces agreement with `package.json`.
- **`src/lib/llms/build.ts`** generates `/llms.txt`, `/skill.md`, `/agents.md` and per-component `.md`.
  Its rules live in `src/lib/llms/rules.ts`, kept alias-free so `scripts/agents.ts` can run it under
  plain Node.

## The registry → CLI contract

This is the part that requires reading several files to understand, and where the subtle bugs live.

`buildItem(name)` walks a component's imports as a **work queue**, not a snapshot — a file it pulls in
gets scanned in its turn, or a helper ships without the package it needs. It produces:

- `files[]`, each with a **`root`** (`'components'` or `'lib'`) and a path relative to that root. The
  CLI resolves each against the matching alias in the consumer's `fajr-ui.json`, which is what lets a
  project put components anywhere while `$lib/utils` still lands where its imports expect.
- `dependencies[]` — npm packages, pinned exactly.
- `registryDependencies[]` — other registry items, resolved recursively by `fajr-ui add`.

Consequences worth knowing before editing a component:

- **Never import from the barrel inside `ui/`.** `import { X } from '../index'` makes the registry
  record a dependency literally called `index`, which 404s the install. Import the file directly.
- Files matching `*.{test,spec,fixture}.*` are excluded from what ships. Tests live beside their
  components, and the glob is a wildcard.
- Components documented under a name that is not their folder need a `FOLDER_ALIAS` entry.

The CLI's edit protection turns on `fajr-ui.lock.json` recording the hash of what the CLI **wrote**,
never what is on disk — adopting a user's edit as the baseline would make the file look merely
outdated and be overwritten a run later. `cli/lib.js` holds the pure logic (`statusOf`, `rootsOf`,
`keyOf`, diff, package-manager detection); `cli/index.js` reads argv and dispatches, so it cannot be
imported from a test.

## Tests

Four suites, three vitest projects plus Playwright, configured in `vite.config.ts` and
`playwright.config.ts`:

| Project  | Matches                   | Environment                                      |
| -------- | ------------------------- | ------------------------------------------------ |
| `cli`    | `cli/**/*.test.js`        | node                                             |
| `server` | `src/**/*.test.ts`        | node                                             |
| `client` | `src/**/*.svelte.test.ts` | real Chromium via Playwright                     |
| e2e      | `e2e/**/*.e2e.ts`         | Playwright, against `pnpm build && pnpm preview` |

The **server** project's `src/lib/registry/build.test.ts` guards the install contract above — dangling
dependencies, unpinned versions, shipped test files, helpers imported but not shipped. It catches
things that would otherwise only fail on a stranger's machine.

The **e2e** suite runs the real CLI against the real built site into scratch directories. It is the
only test that covers the whole pipeline: source → registry generation → prerender → HTTP → install.

Component tests assert through the DOM (`aria-*`, `tabindex`), not through component props — what a
screen reader is told is the thing under test. Where a test needs to add or remove items at runtime,
add a `*.fixture.svelte` beside the component.

## Routing notes

- `src/routes/(site)/` is the marketing and docs shell; `src/routes/examples/<name>/app/` are
  standalone full-screen apps with their own layout, linked from a write-up page under `(site)`.
- `src/routes/r/`, `llms.txt`, `skill.md`, `agents.md` are prerendered endpoints. A component that
  fails to resolve breaks `pnpm build`, not just the page — which is deliberate.
- Every `{#each}` over documentation data must key on something genuinely unique. Duplicate keys have
  twice silently blanked a whole page rather than erroring visibly.
