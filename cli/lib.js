/**
 * The parts of the CLI that are pure functions of their arguments.
 *
 * Split out from `index.js` so they can be tested without running a command:
 * `index.js` reads `process.argv` and dispatches at module scope, so importing
 * it from a test would execute the CLI.
 */
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

/**
 * The hash of a file exactly as this CLI wrote it. Comparing it against what is
 * on disk is how an update tells "untouched, safe to replace" apart from
 * "edited by hand, leave alone" — the whole difficulty with components you own
 * rather than install.
 */
export function hash(content) {
	return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/** Where each kind of file lands, from the project's `fajr-ui.json`. */
export function rootsOf(cwd, config) {
	return {
		components: resolve(cwd, config.aliases?.components ?? 'src/lib/components/ui'),
		lib: resolve(cwd, config.aliases?.lib ?? 'src/lib')
	};
}

/**
 * A file's identity in the lock. Both roots can hold a `utils.ts`, so the root
 * has to be part of the key or one would silently shadow the other.
 */
export function keyOf(file) {
	return `${file.root ?? 'components'}/${file.path}`;
}

/**
 * What to do with one file, from three hashes.
 *
 * `known` is what the lock says this CLI last wrote. The distinction that
 * matters is `outdated` against `modified`: the first is safe to replace, the
 * second is the user's own work and is never touched without `--force`. A file
 * present but absent from the lock counts as outdated — it was put there by
 * something other than this CLI, and taking the registry's copy is the
 * behaviour that makes `add` idempotent.
 */
export function statusOf({ present, current, upstream, known }) {
	if (!present) return 'missing';
	if (current === upstream) return 'current';
	if (known && current !== known) return 'modified';
	return 'outdated';
}

/**
 * Which package manager this project uses, from whichever lockfile it has.
 *
 * The install line used to read `pnpm add` for everyone. Pasting that into an
 * npm project either fails or, worse, succeeds and leaves a second lockfile
 * beside the first.
 */
export function packageManager(cwd) {
	if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun';
	if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
	if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
	if (existsSync(join(cwd, 'package-lock.json'))) return 'npm';
	// `packageManager` in package.json is the other place it is declared, and is
	// authoritative when present — Corepack reads the same field.
	try {
		const field = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8')).packageManager;
		const name = typeof field === 'string' ? field.split('@')[0] : '';
		if (['npm', 'pnpm', 'yarn', 'bun'].includes(name)) return name;
	} catch {
		// No package.json, or not JSON. npm is the safe assumption.
	}
	return 'npm';
}

/** npm is the odd one out: `install` rather than `add`. */
export function addCommand(manager, packages) {
	const verb = manager === 'npm' ? 'install' : 'add';
	return `${manager} ${verb} ${packages.join(' ')}`;
}

/**
 * Minimal unified diff, so `diff` needs no dependency.
 *
 * Returns the changed regions with a little context, already coloured by the
 * `paint` callbacks — or an empty string when the two sides match.
 */
export function unifiedDiff(before, after, path, paint) {
	const { add, del, ctx, head } = paint;
	const a = before.split('\n');
	const b = after.split('\n');
	const lcs = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
	for (let i = a.length - 1; i >= 0; i--) {
		for (let j = b.length - 1; j >= 0; j--) {
			lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
		}
	}

	const lines = [];
	let i = 0;
	let j = 0;
	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			lines.push(['ctx', a[i]]);
			i++;
			j++;
		} else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
			lines.push(['del', a[i++]]);
		} else {
			lines.push(['add', b[j++]]);
		}
	}
	while (i < a.length) lines.push(['del', a[i++]]);
	while (j < b.length) lines.push(['add', b[j++]]);

	if (!lines.some(([kind]) => kind !== 'ctx')) return '';

	// Only the changed regions, with a little context around them.
	const keep = new Set();
	lines.forEach(([kind], index) => {
		if (kind === 'ctx') return;
		for (let k = Math.max(0, index - 3); k <= Math.min(lines.length - 1, index + 3); k++) {
			keep.add(k);
		}
	});

	const out = [head(path)];
	let gap = false;
	lines.forEach(([kind, text], index) => {
		if (!keep.has(index)) {
			if (!gap) out.push(ctx('  ...'));
			gap = true;
			return;
		}
		gap = false;
		if (kind === 'add') out.push(add(`+ ${text}`));
		else if (kind === 'del') out.push(del(`- ${text}`));
		else out.push(ctx(`  ${text}`));
	});
	return out.join('\n');
}
