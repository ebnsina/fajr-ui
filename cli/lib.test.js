import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import {
	addCommand,
	elapsed,
	hash,
	keyOf,
	packageManager,
	rootsOf,
	statusOf,
	unifiedDiff
} from './lib.js';

const plain = { add: (s) => s, del: (s) => s, ctx: (s) => s, head: (s) => s };
const scratch = () => mkdtempSync(join(tmpdir(), 'fajr-cli-'));

describe('hash', () => {
	it('is stable for the same content', () => {
		expect(hash('a\nb\n')).toBe(hash('a\nb\n'));
	});

	it('changes for a single character', () => {
		// The whole edit-detection scheme rests on this. A hash that ignored
		// whitespace would report a reformatted file as untouched and overwrite it.
		expect(hash('const a = 1;')).not.toBe(hash('const a = 1; '));
	});
});

describe('elapsed', () => {
	it('reports milliseconds below a second', () => {
		expect(elapsed(0, 420)).toBe('420ms');
	});

	it('reports one decimal of a second above it', () => {
		expect(elapsed(0, 12_480)).toBe('12.5s');
	});

	it('never reports a negative duration', () => {
		// A clock that steps backwards mid-command should read as instant, not as
		// a command that finished before it started.
		expect(elapsed(500, 100)).toBe('0ms');
	});
});

describe('statusOf', () => {
	const upstream = 'aaa';

	it('reports a file that is not there as missing', () => {
		expect(statusOf({ present: false, current: null, upstream, known: undefined })).toBe('missing');
	});

	it('reports a byte-identical file as current', () => {
		expect(statusOf({ present: true, current: 'aaa', upstream, known: 'aaa' })).toBe('current');
	});

	it('reports a file matching the lock but not the registry as outdated', () => {
		// Written by this CLI, unchanged since, and the registry has moved on.
		expect(statusOf({ present: true, current: 'bbb', upstream, known: 'bbb' })).toBe('outdated');
	});

	it('reports a file that has drifted from the lock as modified', () => {
		// This is the case the whole design exists for: the user edited it.
		expect(statusOf({ present: true, current: 'ccc', upstream, known: 'bbb' })).toBe('modified');
	});

	it('treats an unlocked file as outdated rather than modified', () => {
		// Present but never recorded — put there by something other than this CLI.
		// Calling it modified would make `add` refuse to finish its own install.
		expect(statusOf({ present: true, current: 'bbb', upstream, known: undefined })).toBe(
			'outdated'
		);
	});
});

describe('keyOf', () => {
	it('separates the two roots', () => {
		// A `utils.ts` can exist under both; one key for both would let the lock
		// entry for one silently stand in for the other.
		expect(keyOf({ root: 'lib', path: 'utils.ts' })).not.toBe(
			keyOf({ root: 'components', path: 'utils.ts' })
		);
	});

	it('defaults to the component root', () => {
		expect(keyOf({ path: 'button.svelte' })).toBe('components/button.svelte');
	});
});

describe('rootsOf', () => {
	it('follows both aliases independently', () => {
		// The bug this replaced: helper files were written as `../../utils.ts`
		// relative to the component directory, so moving components out of
		// `$lib/components/ui` put the helpers somewhere no import could find.
		const roots = rootsOf('/project', {
			aliases: { components: 'src/components/ui', lib: 'src/lib' }
		});
		expect(roots.components.split(sep).join('/')).toBe('/project/src/components/ui');
		expect(roots.lib.split(sep).join('/')).toBe('/project/src/lib');
	});

	it('falls back to the SvelteKit defaults', () => {
		const roots = rootsOf('/project', {});
		expect(roots.components.split(sep).join('/')).toBe('/project/src/lib/components/ui');
		expect(roots.lib.split(sep).join('/')).toBe('/project/src/lib');
	});
});

describe('packageManager', () => {
	it.each([
		['pnpm-lock.yaml', 'pnpm'],
		['yarn.lock', 'yarn'],
		['package-lock.json', 'npm'],
		['bun.lock', 'bun']
	])('reads %s as %s', (lockfile, expected) => {
		const dir = scratch();
		writeFileSync(join(dir, lockfile), '');
		expect(packageManager(dir)).toBe(expected);
	});

	it('prefers a lockfile over the packageManager field', () => {
		const dir = scratch();
		writeFileSync(join(dir, 'pnpm-lock.yaml'), '');
		writeFileSync(join(dir, 'package.json'), JSON.stringify({ packageManager: 'yarn@4.0.0' }));
		expect(packageManager(dir)).toBe('pnpm');
	});

	it('falls back to the packageManager field when there is no lockfile', () => {
		const dir = scratch();
		writeFileSync(join(dir, 'package.json'), JSON.stringify({ packageManager: 'yarn@4.0.0' }));
		expect(packageManager(dir)).toBe('yarn');
	});

	it('assumes npm in an empty directory', () => {
		expect(packageManager(scratch())).toBe('npm');
	});

	it('assumes npm rather than throwing on an unreadable package.json', () => {
		const dir = scratch();
		writeFileSync(join(dir, 'package.json'), '{ not json');
		expect(packageManager(dir)).toBe('npm');
	});
});

describe('addCommand', () => {
	it('uses install for npm and add for the rest', () => {
		expect(addCommand('npm', ['a', 'b'])).toBe('npm install a b');
		expect(addCommand('pnpm', ['a'])).toBe('pnpm add a');
		expect(addCommand('yarn', ['a'])).toBe('yarn add a');
		expect(addCommand('bun', ['a'])).toBe('bun add a');
	});
});

describe('unifiedDiff', () => {
	it('is empty when the two sides match', () => {
		// `diff` and `update` both rely on this to decide there is nothing to show.
		expect(unifiedDiff('a\nb\n', 'a\nb\n', 'f.ts', plain)).toBe('');
	});

	it('marks an added line', () => {
		const out = unifiedDiff('a\nb', 'a\nx\nb', 'f.ts', plain);
		expect(out).toContain('+ x');
		expect(out).not.toContain('- ');
	});

	it('marks a removed line', () => {
		const out = unifiedDiff('a\nx\nb', 'a\nb', 'f.ts', plain);
		expect(out).toContain('- x');
	});

	it('names the file it is describing', () => {
		expect(unifiedDiff('a', 'b', 'src/lib/components/ui/button.svelte', plain)).toContain(
			'src/lib/components/ui/button.svelte'
		);
	});

	it('elides the unchanged middle of a long file', () => {
		const before = Array.from({ length: 200 }, (_, i) => `line ${i}`).join('\n');
		const after = before.replace('line 0', 'CHANGED');
		const out = unifiedDiff(before, after, 'f.ts', plain);
		expect(out).toContain('...');
		// Nowhere near 200 lines of output for a one-line change.
		expect(out.split('\n').length).toBeLessThan(20);
	});

	it('handles one side being empty', () => {
		// A `missing` file diffs against '' rather than crashing.
		expect(unifiedDiff('', 'a\nb', 'f.ts', plain)).toContain('+ a');
	});
});
