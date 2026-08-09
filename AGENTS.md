# Working in this repository

This is the Fajr UI source — the library itself, its documentation site, and its CLI.
The block at the bottom is the guidance handed to projects that _use_ the library; it
applies here too, since the docs site is built from these components.

## Before you finish

```sh
pnpm check          # svelte-check — must be 0 errors
pnpm check:versions # pins in package.json and versions.ts must agree
pnpm build          # prerenders every route; catches registry 404s
```

## Generated files — do not edit by hand

Each has one source and a script that writes it. Editing the output means it is
correct until the next run.

| Output                                     | Source                      | Regenerate       |
| ------------------------------------------ | --------------------------- | ---------------- |
| `CHANGELOG.md`                             | `src/lib/data/changelog.ts` | `pnpm changelog` |
| `AGENTS.md` block, `.claude/skills/`       | `src/lib/llms/build.ts`     | `pnpm agents`    |
| `/llms.txt`, `/llms-full.txt`, `*.md` docs | `src/lib/llms/build.ts`     | at build         |
| `/r/*.json` registry                       | `src/lib/registry/build.ts` | at build         |

The same rule applies to anything with two copies. Component docs come from
`src/lib/docs/registry.ts`, examples are real `.svelte` files under
`src/lib/docs/examples/` rendered _and_ shown as source, and dependency versions
live only in `src/lib/registry/versions.ts`. If you find yourself writing a fact
in a second place, derive it instead.

## Verify in a browser, not by reading

Layout, contrast and interaction bugs in this codebase have consistently been
invisible in the source and obvious on screen. Load the page, drive the control,
measure the thing. Several defects here — a blanked tab panel, a mobile menu
that silently did nothing, two chart colours below the contrast floor — passed
typecheck and review and were only caught by looking.

## Standards that are not negotiable

- **Contrast.** Text clears 4.5:1 against its surface; anything non-text — a
  chart series, a control border, a focus ring — clears 3:1. Measure it by
  painting the token to a canvas and reading the pixel; computed styles come
  back as `oklch()` and naive parsing reports nonsense.
- **No layout shift.** A control whose contents change keeps its size. Reserve
  the space rather than letting the page jump.
- **Keyboard and ARIA are the component's own job.** Each one owns its focus
  management and roles, and leans on the platform where the platform is already
  correct. Do not bolt a `role` onto a component from outside.
- **Tokens, never literals.** A hard-coded colour does not follow the theme, the
  dark mode, or the accent.
- **Touch.** 44px hit targets on a coarse pointer, without changing size on a
  mouse.

## House style

- Comments explain _why_, and earn their place. A comment restating the code is
  noise; one recording the constraint that forced an odd-looking line is the
  most valuable thing in the file.
- Match the surrounding code — its naming, its density, its idiom.
- Svelte 5 runes throughout. No `export let`, no `$:`, no `on:` directives.
- British spelling in prose; `colour` in comments, `color` in CSS.
- Do not name other component libraries anywhere — not in code, comments, docs
  copy, CSS, or asset names.
- Demo content draws on Islamic culture and the Golden Age of Islam. Keep it
  consistent when adding examples.

<!-- fajr-ui:start -->

## Fajr UI

This project uses Fajr UI. Components live in `src/lib/components/ui` and were copied in, not installed — editing one is editing a local file.

- Import components from `$lib/components/ui` — never from a file inside it. `import { Button, Dialog } from '$lib/components/ui';`
- Chart definition helpers (`defineChart`, `barY`, `lineY`, `areaY`, `scaleBand`, `scaleLinear`, `tooltip`) come from `$lib/internal/chart`, not from the component barrel. The barrel exports a `tooltip` _action_, which is a different thing.
- This is Svelte 5 with runes. Use `$state`, `$derived` and `$props()`. Do not write `export let`, `$:` reactive statements, or `on:click` — the event attribute is `onclick`.
- Two-way props are `$bindable`, so `bind:open`, `bind:value` and `bind:checked` work as written.
- Style with Tailwind utility classes and the semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`). Never hard-code a hex colour — it will not follow the theme.
- `class` is merged onto the component root with `cn()`; later utilities win. There is no `style` prop convention.
- Components are copied into the project, not installed. To change one, edit its file — do not wrap it to override styling.
- Every interactive component already handles its own keyboard, focus and ARIA. Do not add `role`, `tabindex` or `aria-*` on top unless the docs for that component say to.
- A chart needs a `label` prop: a sentence describing what it shows. It is the accessible name and is required.

Component documentation: `https://ebnsina.github.io/fajr-ui/docs/components/<slug>.md`. Full index: `https://ebnsina.github.io/fajr-ui/llms.txt`.
Add a component with `npx fajr-ui add <slug>`; update with `npx fajr-ui update`.
<!-- fajr-ui:end -->
