/**
 * The instructions handed to agents, and the two files built from them.
 *
 * Deliberately free of `$lib` aliases and Vite globs: `scripts/agents.ts` runs
 * this under plain Node to write the checked-in copies, and the documentation
 * site imports the same functions. One source, two consumers, no drift.
 */

/** Must match the registry host the CLI defaults to — see `cli/index.js`. */
export const SITE = 'https://fajr-ui.dev';

/** The things an agent gets wrong if nobody tells it. Kept first, and short. */
export const RULES = [
	"Import components from `$lib/components/ui` — never from a file inside it. `import { Button, Dialog } from '$lib/components/ui';`",
	'Chart definition helpers (`defineChart`, `barY`, `lineY`, `areaY`, `scaleBand`, `scaleLinear`, `tooltip`) come from `$lib/internal/chart`, not from the component barrel. The barrel exports a `tooltip` _action_, which is a different thing.',
	'This is Svelte 5 with runes. Use `$state`, `$derived` and `$props()`. Do not write `export let`, `$:` reactive statements, or `on:click` — the event attribute is `onclick`.',
	'Two-way props are `$bindable`, so `bind:open`, `bind:value` and `bind:checked` work as written.',
	'Style with Tailwind utility classes and the semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`). Never hard-code a hex colour — it will not follow the theme.',
	'`class` is merged onto the component root with `cn()`; later utilities win. There is no `style` prop convention.',
	'Components are copied into the project, not installed. To change one, edit its file — do not wrap it to override styling.',
	'Every interactive component already handles its own keyboard, focus and ARIA. Do not add `role`, `tabindex` or `aria-*` on top unless the docs for that component say to.',
	'A chart needs a `label` prop: a sentence describing what it shows. It is the accessible name and is required.'
];

export function fence(code: string, lang = 'svelte'): string {
	return ['```' + lang, code, '```'].join('\n');
}

/**
 * An agent skill, for dropping into a project that uses this library.
 *
 * Deliberately short. A skill is loaded into context on every relevant turn, so
 * it carries the rules an agent gets wrong and the addresses to fetch when it
 * needs detail — not the API itself, which is what the `.md` files are for.
 */
export function skillMarkdown(): string {
	return [
		'---',
		'name: fajr-ui',
		'description: Build interfaces with Fajr UI, a copy-into-your-project component library for Svelte 5 and Tailwind v4. Use when adding, editing or styling UI components, charts, forms, dialogs or theming in a project that has Fajr UI installed.',
		'---',
		'',
		'# Fajr UI',
		'',
		'Components live in `src/lib/components/ui` in **this** repository — they were copied in, not installed. Editing one is editing a local file.',
		'',
		'## Rules',
		'',
		...RULES.map((rule) => `- ${rule}`),
		'',
		'## Before writing a component you have not used here before',
		'',
		'Fetch its documentation rather than guessing the props:',
		'',
		fence(`${SITE}/docs/components/<slug>.md`, 'text'),
		'',
		`Slugs are kebab-case: \`alert-dialog\`, \`data-table\`, \`number-field\`. The full list is at ${SITE}/llms.txt.`,
		'',
		'## Adding a component that is not in the project yet',
		'',
		fence('npx fajr-ui add <slug>', 'sh'),
		'',
		'This copies the component and everything it composes. If it needs third-party packages the command prints them with exact versions — install those versions, not `latest`; several are pre-1.0 where a minor release may break the API.',
		'',
		'## Updating',
		'',
		'`npx fajr-ui outdated` reports what changed upstream, `diff` shows it, `update` merges it in and leaves files you have edited alone. Never hand-edit a file to match upstream — run `update`.',
		'',
		'## Checking your work',
		'',
		'- Does it read correctly with only a keyboard? Every component handles this already; adding your own handlers usually breaks it.',
		'- Do the colours come from tokens, so light, dark and all three accents follow?',
		'- Does anything change size as state changes? Reserve the space instead — this library treats layout shift as a bug.',
		''
	].join('\n');
}

/**
 * The same rules as a plain block for `AGENTS.md`, which is the file most
 * coding agents read without being asked. Wrapped in markers so it can be
 * refreshed in place without disturbing whatever else is in the file.
 */
export function agentsMarkdown(): string {
	return [
		// A blank line after the marker: an HTML comment butted against a heading
		// is not a paragraph break, and the output has to survive `pnpm lint`
		// without anyone reformatting a generated file by hand.
		'<!-- fajr-ui:start -->',
		'',
		'## Fajr UI',
		'',
		'This project uses Fajr UI. Components live in `src/lib/components/ui` and were copied in, not installed — editing one is editing a local file.',
		'',
		...RULES.map((rule) => `- ${rule}`),
		'',
		`Component documentation: \`${SITE}/docs/components/<slug>.md\`. Full index: \`${SITE}/llms.txt\`.`,
		'Add a component with `npx fajr-ui add <slug>`; update with `npx fajr-ui update`.',
		'<!-- fajr-ui:end -->'
	].join('\n');
}
