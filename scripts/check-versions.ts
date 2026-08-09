/**
 * Fails if `src/lib/registry/versions.ts` and `package.json` disagree, or if a
 * dependency is declared with a range rather than an exact version.
 *
 * The registry hands its versions straight to someone else's package manager,
 * so a stale entry here ships a broken install to every consumer of the CLI —
 * and it would ship silently, because our own `node_modules` would still hold
 * the version that worked. Run by `pnpm check:versions`.
 */
import { readFileSync } from 'node:fs';
import { PINNED } from '../src/lib/registry/versions.ts';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const declared: Record<string, string> = pkg.dependencies ?? {};

const problems: string[] = [];

for (const [name, range] of Object.entries(declared)) {
	if (/^[\^~><*]|\s|\|\|/.test(range)) {
		problems.push(`${name} is declared as "${range}" — dependencies must be pinned exactly.`);
	}
	if (!PINNED[name]) {
		problems.push(`${name} is missing from PINNED in src/lib/registry/versions.ts.`);
	} else if (PINNED[name] !== range) {
		problems.push(`${name}: package.json has ${range}, PINNED has ${PINNED[name]}.`);
	}
}

for (const name of Object.keys(PINNED)) {
	if (!declared[name]) problems.push(`${name} is in PINNED but not a dependency.`);
}

if (problems.length) {
	console.error('\nVersion pins are out of step:\n');
	for (const problem of problems) console.error(`  ${problem}`);
	console.error('');
	process.exit(1);
}

console.log(`Version pins agree — ${Object.keys(PINNED).length} packages.`);
