import { describe, expect, it } from 'vitest';
import { allItemNames, buildItem, fileKey, registryIndex } from './build';

/*
 * These are the invariants the CLI depends on. Nothing here checks how a
 * component looks — it checks that what the registry serves can actually be
 * installed. A component whose files are missing, or that names a dependency
 * the registry cannot serve, fails only on a stranger's machine.
 */

const names = allItemNames();
const items = names.map((name) => [name, buildItem(name)] as const);

describe('registry index', () => {
	it('lists something', () => {
		expect(names.length).toBeGreaterThan(0);
	});

	it('has no duplicate slugs', () => {
		expect(new Set(names).size).toBe(names.length);
	});

	it('describes every entry', () => {
		for (const entry of registryIndex()) {
			expect(entry.title, entry.name).toBeTruthy();
			expect(entry.description, entry.name).toBeTruthy();
		}
	});
});

describe('every built component', () => {
	it('resolves to an item', () => {
		// The failure this catches: a component marked `built` whose folder the
		// glob does not match, which 404s `/r/<name>.json` and fails the build.
		const missing = items.filter(([, item]) => !item).map(([name]) => name);
		expect(missing).toEqual([]);
	});

	it('ships at least one file', () => {
		for (const [name, item] of items) {
			expect(item!.files.length, name).toBeGreaterThan(0);
		}
	});

	it('gives every file a root the CLI knows', () => {
		for (const [name, item] of items) {
			for (const file of item!.files) {
				expect(['components', 'lib'], `${name} → ${file.path}`).toContain(file.root);
			}
		}
	});

	it('writes no path that climbs out of its root', () => {
		// `../..` was how helper paths used to be expressed. If one comes back the
		// CLI writes outside the directory the user configured.
		for (const [name, item] of items) {
			for (const file of item!.files) {
				expect(file.path, name).not.toContain('..');
			}
		}
	});

	it('has no two files at the same key', () => {
		for (const [name, item] of items) {
			const keys = item!.files.map(fileKey);
			expect(new Set(keys).size, `${name}: ${keys.join(', ')}`).toBe(keys.length);
		}
	});

	it('ships no test file or fixture', () => {
		// These sit beside the components they cover and the registry glob is a
		// wildcard, so they would otherwise be copied into every project that
		// installed the component, importing `vitest` from a dependency it has not
		// got.
		for (const [name, item] of items) {
			for (const file of item!.files) {
				expect(file.path, name).not.toMatch(/\.(test|spec|fixture)\./);
			}
		}
	});

	it('ships no empty file', () => {
		for (const [name, item] of items) {
			for (const file of item!.files) {
				expect(file.content.length, `${name} → ${file.path}`).toBeGreaterThan(0);
			}
		}
	});
});

describe('dependencies', () => {
	it('pins every npm package to an exact version', () => {
		// Unpinned, an install picks up whatever is latest that day — and one of
		// these is pre-alpha, where a minor release may change the API.
		for (const [name, item] of items) {
			for (const dependency of item!.dependencies) {
				expect(dependency, `${name} → ${dependency}`).toMatch(/.@\d+\.\d+\.\d+/);
			}
		}
	});

	it('names only registry items the registry can serve', () => {
		// A dangling name makes `add` fetch a 404 and exit, part-installed.
		const known = new Set(names);
		for (const [name, item] of items) {
			for (const dependency of item!.registryDependencies) {
				expect(known.has(dependency), `${name} needs ${dependency}`).toBe(true);
			}
		}
	});

	it('does not depend on itself', () => {
		for (const [name, item] of items) {
			expect(item!.registryDependencies, name).not.toContain(name);
		}
	});

	it('resolves the whole graph from any single component', () => {
		// What `fajr-ui add <one>` walks. If this terminates for every entry point,
		// no install can end up missing a piece it composes.
		const resolve = (start: string) => {
			const seen = new Set<string>();
			const queue = [start];
			while (queue.length) {
				const next = queue.pop()!;
				if (seen.has(next)) continue;
				seen.add(next);
				const item = buildItem(next);
				expect(item, `${start} → ${next}`).toBeDefined();
				queue.push(...item!.registryDependencies);
			}
			return seen;
		};
		for (const name of names) expect(resolve(name).has(name)).toBe(true);
	});
});

describe('imports', () => {
	it('ships a file for every $lib helper a component imports', () => {
		// `$lib/utils` and friends do not exist in the user's project until the
		// registry puts them there. A component that imports one without shipping
		// it installs and then fails on its own first line.
		const HELPER = /from\s+['"](\$lib\/(?:utils|icons|internal\/[\w-]+|actions\/[\w-]+))['"]/g;
		for (const [name, item] of items) {
			const shipped = new Set(item!.files.filter((f) => f.root === 'lib').map((f) => f.path));
			for (const file of item!.files) {
				for (const [, specifier] of file.content.matchAll(HELPER)) {
					const expected = `${specifier.replace('$lib/', '')}.ts`;
					expect(shipped.has(expected), `${name} → ${file.path} imports ${specifier}`).toBe(true);
				}
			}
		}
	});
});
