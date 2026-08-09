import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * The published tarball is the only artefact users ever run, and nothing else
 * in the suite touches it — the e2e test executes `cli/index.js` straight from
 * the working tree, where every sibling file is present whether or not npm
 * would ship it. A `files` list that missed `lib.js` therefore passed all four
 * suites and still crashed on `ERR_MODULE_NOT_FOUND` for every command.
 *
 * So walk the import graph from the bin entry and demand that npm has been
 * told to include each file it reaches.
 */

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(here, 'package.json'), 'utf8'));

/** Every relative specifier a file imports, as a path relative to `cli/`. */
function importsOf(file) {
	const source = readFileSync(join(here, file), 'utf8');
	const specifiers = source.matchAll(/^\s*(?:import|export)[^'"]*from\s*'(\.[^']*)'/gm);
	return [...specifiers].map(([, specifier]) =>
		relative(here, join(here, dirname(file), specifier))
	);
}

/** The bin entry plus everything reachable from it, transitively. */
function shippedGraph() {
	const seen = new Set();
	const queue = Object.values(pkg.bin).map((path) => relative(here, join(here, path)));

	while (queue.length) {
		const file = queue.shift();
		if (seen.has(file)) continue;
		seen.add(file);
		queue.push(...importsOf(file));
	}

	return [...seen];
}

describe('the published package', () => {
	it('ships every file the bin entry imports', () => {
		for (const file of shippedGraph()) {
			expect(pkg.files, `${file} is imported but not listed in "files"`).toContain(file);
		}
	});

	it('ships nothing it does not need', () => {
		// Not a size concern — a stray `lib.test.js` in the tarball would mean the
		// exclusion glob had stopped working, and tests are the one thing that
		// reaches for dev dependencies a consumer will not have installed.
		expect(pkg.files.sort()).toEqual(shippedGraph().sort());
	});

	it('declares the metadata npm renders on the package page', () => {
		// A missing repository link costs provenance; a missing licence field
		// makes the package legally ambiguous however clear the LICENSE file is.
		expect(pkg.repository?.url).toBeTruthy();
		expect(pkg.license).toBeTruthy();
		expect(pkg.description).toBeTruthy();
	});
});
