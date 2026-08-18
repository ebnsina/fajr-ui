import { components } from '$lib/data/components';
import { packageOf, pinned } from './versions';

export type RegistryFile = {
	/**
	 * Which alias in the consumer's `fajr-ui.json` this path is relative to.
	 *
	 * Components go under `aliases.components`; the shared helpers they import as
	 * `$lib/utils` and friends go under `aliases.lib`. Naming the root is what
	 * makes the second alias mean anything: the paths used to be written as
	 * `../../utils.ts`, climbing out of the component directory, which only
	 * landed in the right place if that directory happened to sit exactly two
	 * levels under `$lib`. Move components to `src/components/ui` and the helper
	 * was written to `src/utils.ts`, where no import would find it.
	 */
	root: 'components' | 'lib';
	/** Path relative to that root. */
	path: string;
	content: string;
};

/** Identity of a file across both roots — a `utils.ts` could exist in either. */
export function fileKey(file: Pick<RegistryFile, 'root' | 'path'>): string {
	return `${file.root}/${file.path}`;
}

export type RegistryItem = {
	name: string;
	title: string;
	description: string;
	type: 'registry:ui' | 'registry:style';
	/**
	 * npm packages this component imports, each carrying the exact version it
	 * was built against — see `./versions`. The CLI passes these to the package
	 * manager verbatim, so an install reproduces what was tested rather than
	 * whatever is latest that day.
	 */
	dependencies: string[];
	/** Other registry items it composes, pulled in automatically. */
	registryDependencies: string[];
	files: RegistryFile[];
};

/*
 * Component sources are read at build time with Vite's raw glob, so the registry
 * is generated from the same files the site renders. There is no second copy to
 * keep in step, which is the usual way a registry drifts from its library.
 */
const sources = import.meta.glob('/src/lib/components/ui/**/*.{svelte,ts}', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const extrasByPath: Record<string, Record<string, string>> = {
	'$lib/utils': import.meta.glob('/src/lib/utils.ts', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>,
	'$lib/icons': import.meta.glob('/src/lib/icons.ts', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>,
	'$lib/internal': import.meta.glob('/src/lib/internal/*.ts', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>,
	'$lib/actions': import.meta.glob('/src/lib/actions/*.ts', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>
};

const UI_ROOT = '/src/lib/components/ui/';

/**
 * The design tokens, as an installable item.
 *
 * Every component reads `--border`, `--input`, `--ring` and the rest, and none
 * of them carry a fallback — a border whose token is missing renders in the
 * element's own text colour rather than not rendering at all. So a project that
 * ran `add button` without first copying this file by hand got a button that
 * looked broken in a way that pointed nowhere near the cause.
 *
 * Shipping it as an item is what lets `init` install it and `add` check for it,
 * instead of the instruction living only in prose on the get-started page.
 */
const THEME_NAME = 'theme';
const THEME_PATH = 'styles/theme.css';

const themeSource = import.meta.glob('/src/lib/styles/theme.css', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function themeItem(): RegistryItem {
	const [content] = Object.values(themeSource);
	return {
		name: THEME_NAME,
		title: 'Theme',
		description: 'The design tokens every component reads, in both light and dark.',
		type: 'registry:style',
		dependencies: [],
		registryDependencies: [],
		files: [{ root: 'lib', path: THEME_PATH, content }]
	};
}

/**
 * Tests and their fixtures live beside the components they cover, and the globs
 * above are wildcards, so without this they would be copied into every project
 * that installed the component — along with an import of `vitest` that the
 * project has no reason to have installed.
 */
const NOT_SHIPPED = /\.(test|spec|fixture)\.(svelte|ts)$/;

/**
 * Components documented under their own name that live in another's folder.
 *
 * Autocomplete is a Combobox with a different opening behaviour and shares its
 * context and parts, so it ships the whole folder. Without this the registry
 * found no files for the slug, returned nothing, and `/r/autocomplete.json`
 * 404ed — which failed the prerender and so the whole build.
 */
const FOLDER_ALIAS: Record<string, string> = { autocomplete: 'combobox' };

/**
 * Entries whose implementation is an action rather than a component, so there is
 * no folder under the component root to find. Tooltip used to be one; it now
 * ships both, and its folder re-exports the action, so the scan picks the action
 * file up on its own.
 */
const ACTION_ITEMS: Record<string, string> = {};

/** Every file belonging to one component: a single file, or a whole folder. */
function filesFor(name: string): RegistryFile[] {
	const action = ACTION_ITEMS[name];
	if (action) {
		const bucket = extrasByPath['$lib/actions'];
		const key = Object.keys(bucket).find((path) => path.endsWith(action));
		return key ? [{ root: 'lib' as const, path: `actions/${action}`, content: bucket[key] }] : [];
	}

	const folder = `${UI_ROOT}${FOLDER_ALIAS[name] ?? name}/`;
	const single = `${UI_ROOT}${name}.svelte`;

	const inFolder = Object.keys(sources)
		.filter((path) => path.startsWith(folder) && !NOT_SHIPPED.test(path))
		.sort();
	if (inFolder.length > 0) {
		return inFolder.map((path) => ({
			root: 'components' as const,
			path: path.slice(UI_ROOT.length),
			content: sources[path]
		}));
	}
	if (single in sources) {
		return [{ root: 'components' as const, path: `${name}.svelte`, content: sources[single] }];
	}
	return [];
}

const IMPORT = /(?:import|export)[\s\S]*?from\s+['"]([^'"]+)['"]/g;

function importsOf(content: string): string[] {
	return [...content.matchAll(IMPORT)].map((match) => match[1]);
}

/** Maps a relative import back to the registry item that owns it. */
function ownerOf(specifier: string, fromPath: string): string | undefined {
	const base = fromPath.includes('/') ? fromPath.slice(0, fromPath.lastIndexOf('/')) : '';
	const stack: string[] = [];
	for (const part of `${base}/${specifier}`.split('/')) {
		if (part === '.' || part === '') continue;
		if (part === '..') stack.pop();
		else stack.push(part);
	}
	const head = stack[0];
	return head ? head.replace(/\.(svelte|ts)$/, '') : undefined;
}

export function buildItem(name: string): RegistryItem | undefined {
	if (name === THEME_NAME) return themeItem();

	const entry = components.find((component) => component.slug === name);
	const files = filesFor(name);
	if (!entry || files.length === 0) return undefined;

	const dependencies = new Set<string>();
	const registryDependencies = new Set<string>();
	const seen = new Set(files.map(fileKey));

	const addExtra = (group: string, fileName: string, target: string) => {
		const bucket = extrasByPath[group];
		const key = Object.keys(bucket).find((path) => path.endsWith(fileName));
		const entry = { root: 'lib' as const, path: target };
		if (!key || seen.has(fileKey(entry))) return;
		seen.add(fileKey(entry));
		files.push({ ...entry, content: bucket[key] });
	};

	/*
	 * A queue rather than a snapshot, because a file the scan pulls in has
	 * imports of its own. `internal/pacer.ts` needs `@tanstack/pacer` and
	 * `internal/chart.ts` needs `@tanstack/charts` — under a snapshot both were
	 * shipped without their packages ever reaching `dependencies`, so a CLI
	 * install wrote a file that could not resolve its own first import.
	 */
	const queue = [...files];
	for (let index = 0; index < queue.length; index++) {
		const file = queue[index];
		const before = files.length;
		for (const specifier of importsOf(file.content)) {
			if (specifier === '$lib/utils') {
				addExtra('$lib/utils', 'utils.ts', 'utils.ts');
			} else if (specifier === '$lib/icons') {
				addExtra('$lib/icons', 'icons.ts', 'icons.ts');
			} else if (specifier.startsWith('$lib/internal/')) {
				const leaf = specifier.split('/').pop();
				addExtra('$lib/internal', `${leaf}.ts`, `internal/${leaf}.ts`);
			} else if (specifier.startsWith('$lib/actions/')) {
				const leaf = specifier.split('/').pop();
				addExtra('$lib/actions', `${leaf}.ts`, `actions/${leaf}.ts`);
			} else if (specifier.startsWith('$')) {
				continue;
			} else if (specifier.startsWith('.')) {
				const owner = ownerOf(specifier, file.path);
				if (!owner || owner === name) continue;
				if (owner === 'internal') {
					// `ui/internal/` holds helpers shared between components, not
					// components of its own — ship the file rather than name it as a
					// dependency the CLI would then fail to resolve.
					const leaf = specifier
						.split('/')
						.pop()!
						.replace(/\.(svelte|ts)$/, '');
					const key = Object.keys(sources).find(
						(path) => path.startsWith(`${UI_ROOT}internal/${leaf}`) && !NOT_SHIPPED.test(path)
					);
					if (key) {
						const entry = { root: 'components' as const, path: key.slice(UI_ROOT.length) };
						if (!seen.has(fileKey(entry))) {
							seen.add(fileKey(entry));
							files.push({ ...entry, content: sources[key] });
						}
					}
					continue;
				}
				registryDependencies.add(owner);
			} else if (specifier !== 'svelte' && !specifier.startsWith('svelte/')) {
				dependencies.add(pinned(packageOf(specifier)));
			}
		}
		// Anything this file dragged in gets scanned in its turn.
		if (files.length > before) queue.push(...files.slice(before));
	}

	return {
		name,
		title: entry.name,
		description: entry.description,
		type: 'registry:ui',
		dependencies: [...dependencies].sort(),
		registryDependencies: [...registryDependencies].sort(),
		files
	};
}

export function registryIndex() {
	return components
		.filter((component) => component.built)
		.map((component) => ({
			name: component.slug,
			title: component.name,
			description: component.description
		}));
}

/**
 * Everything served under `/r/`, which is what the prerenderer walks.
 *
 * The theme is here but deliberately absent from `registryIndex` above: it has
 * to be fetchable at `/r/theme.json`, but it is not a component and listing it
 * among them would put a stylesheet in the middle of `fajr-ui list`.
 */
export function allItemNames(): string[] {
	return [
		...components.filter((component) => component.built).map((component) => component.slug),
		THEME_NAME
	];
}
