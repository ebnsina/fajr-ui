import { describe, expect, it } from 'vitest';
import { CATEGORIES, components, shelves } from './components';

/*
 * The home page browses by shelf, not alphabetically, so a component that is on
 * the roster but on no shelf simply does not appear there — and nothing else
 * fails, because the docs, the registry and the sidebar all read the roster
 * directly. These are the tests that turn that silence into a failure.
 */
describe('catalogue shelves', () => {
	const shelved = CATEGORIES.flatMap((category) => category.slugs);
	const built = components.filter((component) => component.built).map((c) => c.slug);

	it('gives every built component a shelf', () => {
		expect(built.filter((slug) => !shelved.includes(slug))).toEqual([]);
	});

	it('puts no component on two shelves', () => {
		const seen = shelved.filter((slug, index) => shelved.indexOf(slug) !== index);
		expect(seen).toEqual([]);
	});

	it('names no component that is not on the roster', () => {
		const known = new Set(components.map((component) => component.slug));
		expect(shelved.filter((slug) => !known.has(slug))).toEqual([]);
	});

	it('leaves no shelf empty', () => {
		expect(shelves.filter((shelf) => shelf.components.length === 0).map((s) => s.name)).toEqual([]);
	});
});
