import { components, builtComponents } from '$lib/data/components';
import { examples } from '$lib/data/examples';
import { docs, type ComponentDoc } from '$lib/docs/registry';
import { exampleSource } from '$lib/docs/examples';
import { PINNED, pinned } from '$lib/registry/versions';
import { releases } from '$lib/data/changelog';
import { RULES, SITE, fence } from './rules';

/**
 * Generates the plain-text views of this documentation for language models.
 *
 * Everything here is derived from the same modules the site renders — the
 * component list, the docs registry, the example files, the version pins. There
 * is no second copy of the API to keep in step, which is the usual reason a
 * machine-readable export drifts from the human one and starts handing out
 * props that no longer exist.
 *
 * Two views, per the llms.txt convention:
 *
 *   /llms.txt       an index: what this is, the rules, and where to read more
 *   /llms-full.txt  every component's API and examples inline, for pasting
 *
 * plus /docs/components/<slug>.md for one component at a time, which is what an
 * agent actually wants when it is about to write a single import.
 */

function propsTable(doc: ComponentDoc): string[] {
	if (!doc.api?.length) return [];
	const out: string[] = [];
	for (const section of doc.api) {
		out.push(`#### ${section.title}`, '');
		out.push('| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
		for (const row of section.rows) {
			const cell = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
			out.push(
				`| \`${cell(row.name)}\` | \`${cell(row.type)}\` | ${row.default ? `\`${cell(row.default)}\`` : '—'} | ${cell(row.description)} |`
			);
		}
		out.push('');
	}
	return out;
}

/** One component, as markdown. Also served at /docs/components/<slug>.md. */
export function componentMarkdown(slug: string): string | undefined {
	const entry = components.find((component) => component.slug === slug);
	if (!entry) return undefined;
	const doc = docs[slug];
	const out: string[] = [`# ${entry.name}`, '', entry.description, ''];

	out.push('## Install', '', fence(`npx fajr-ui add ${slug}`, 'sh'), '');

	if (doc?.dependencies?.length) {
		const packages = doc.dependencies.map((dependency) => pinned(dependency.name));
		out.push(
			`This one needs third-party packages. The versions are exact on purpose — install them as written:`,
			'',
			fence(`pnpm add ${packages.join(' ')}`, 'sh'),
			''
		);
		for (const dependency of doc.dependencies) {
			out.push(`- \`${dependency.name}\` — ${dependency.purpose}`);
		}
		out.push('');
	}

	if (doc?.usage) out.push('## Usage', '', fence(doc.usage), '');

	const api = propsTable(doc ?? {});
	if (api.length) out.push('## API', '', ...api);

	const shown = [doc?.hero, ...(doc?.examples ?? [])].filter(Boolean);
	const withCode = shown
		.map((example) => ({ example: example!, code: exampleSource(slug, example!.id) }))
		.filter((entry) => entry.code);

	if (withCode.length) {
		out.push('## Examples', '');
		for (const { example, code } of withCode) {
			out.push(`### ${example.title}`, '');
			if (example.description) out.push(example.description, '');
			out.push(fence(code!), '');
		}
	}

	if (doc?.notes?.length) {
		out.push('## Notes', '');
		// The notes carry the reasoning — usually the most useful part for a model,
		// because it explains the constraint rather than restating the signature.
		for (const note of doc.notes) out.push(`- ${note}`);
		out.push('');
	}

	return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function preamble(): string[] {
	const latest = releases[0];
	return [
		'# Fajr UI',
		'',
		`> An accessible component library for Svelte 5 and Tailwind v4. Components are **copied into your project** rather than installed from a package — the file lands in the repository and is yours to edit. ${builtComponents.length} components, no runtime dependency, no configuration layer.`,
		'',
		`Version ${latest.version}. Site: ${SITE}`,
		'',
		'## Rules an agent should follow',
		'',
		...RULES.map((rule) => `- ${rule}`),
		''
	];
}

function facts(): string[] {
	return [
		'## Getting a component',
		'',
		fence('npx fajr-ui add dialog', 'sh'),
		'',
		'This copies the component and everything it composes, and records a hash of each file. `npx fajr-ui outdated` reports what has changed upstream, `diff` shows it, and `update` merges it in while leaving files you have edited alone.',
		'',
		'## Theming',
		'',
		'Every colour resolves from a CSS custom property declared once on `:root` and once on `.dark`, and exposed to Tailwind through `@theme inline`. Use the semantic name, never a literal value.',
		'',
		'| Token | Use for |',
		'| --- | --- |',
		'| `--background` / `--foreground` | Page surface and its text |',
		'| `--card` / `--card-foreground` | Raised surfaces |',
		'| `--popover` / `--popover-foreground` | Floating surfaces |',
		'| `--primary` / `--primary-foreground` | The main action |',
		'| `--secondary`, `--muted`, `--accent` | Quieter fills |',
		'| `--destructive`, `--success`, `--warning`, `--info` | Status tones |',
		'| `--border`, `--input`, `--ring` | Edges and focus rings |',
		'| `--chart-1` … `--chart-5` | Categorical chart series |',
		'',
		'Accents are a second axis, set with `data-accent` on the root element: `black` (default, no attribute), `orange`, `blue`. An accent changes only the primary surface, its foreground, the focus ring and the hue the chart palette is built from.',
		'',
		'## Dependency versions',
		'',
		'Pinned exactly, because several are pre-1.0 where a minor release may break the API. Install these versions rather than `latest`:',
		'',
		...Object.entries(PINNED).map(([name, version]) => `- \`${name}@${version}\``),
		''
	];
}

/** The index view: short, all links, no inline API. */
export function llmsTxt(): string {
	const out = [...preamble()];

	out.push(
		'## Documentation',
		'',
		`- [Introduction](${SITE}/docs): what it is and how copying works`,
		`- [Get started](${SITE}/docs/get-started): dependencies and setup`,
		`- [CLI](${SITE}/docs/cli): add, outdated, diff, update`,
		`- [Theming](${SITE}/docs/theming): tokens, dark mode, accents`,
		`- [Styling](${SITE}/docs/styling): how to change a component`,
		`- [Roadmap](${SITE}/docs/roadmap): what is next and what is deliberately missing`,
		''
	);

	out.push('## Components', '');
	for (const entry of builtComponents) {
		out.push(`- [${entry.name}](${SITE}/docs/components/${entry.slug}.md): ${entry.description}`);
	}
	out.push('');

	out.push('## Examples', '');
	for (const example of examples) {
		out.push(`- [${example.name}](${SITE}${example.href}): ${example.description}`);
	}
	out.push('');

	out.push(...facts());

	out.push(
		'## Optional',
		'',
		`- [Everything inline](${SITE}/llms-full.txt): every component's API and examples in one file`,
		`- [Machine-readable registry](${SITE}/r/index.json): component list, files and pinned dependencies`,
		''
	);

	return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** The full view: everything, for a model that can hold it. */
export function llmsFullTxt(): string {
	const out = [...preamble(), ...facts()];

	out.push('## Examples', '');
	for (const example of examples) {
		out.push(
			`- **${example.name}** — ${example.description} Built from: ${example.uses.join(', ')}. ${SITE}${example.href}`
		);
	}
	out.push('');

	out.push('---', '', '# Components', '');
	for (const entry of builtComponents) {
		const markdown = componentMarkdown(entry.slug);
		if (!markdown) continue;
		// Demote one level so each component sits under the Components heading.
		out.push(markdown.replace(/^#/gm, '##'), '---', '');
	}

	return out.join('\n').replace(/\n{3,}/g, '\n\n');
}
