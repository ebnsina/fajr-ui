import type { Component } from 'svelte';

/**
 * Every example is a real, standalone `.svelte` file under `examples/`. It is
 * imported twice: once as a component to render, and once as raw text to show.
 *
 * That is the whole point of the arrangement — the code on the page and the
 * thing rendered beside it are the same file, so they cannot drift apart. The
 * previous version kept the snippet as a string in the registry and the markup
 * in a separate branch, and nothing stopped the two from disagreeing.
 */
const modules = import.meta.glob('./examples/*/*.svelte', {
	eager: true
}) as Record<string, { default: Component }>;

const sources = import.meta.glob('./examples/*/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function key(slug: string, id: string): string {
	return `./examples/${slug}/${id}.svelte`;
}

export function exampleComponent(slug: string, id: string): Component | undefined {
	return modules[key(slug, id)]?.default;
}

/** The file's own text, trimmed of the trailing newline the editor leaves. */
export function exampleSource(slug: string, id: string): string | undefined {
	return sources[key(slug, id)]?.replace(/\s+$/, '');
}

export function hasExample(slug: string, id: string): boolean {
	return key(slug, id) in modules;
}
