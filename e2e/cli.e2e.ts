import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

/*
 * The CLI against the built site, not the dev server.
 *
 * Everything the CLI reads is prerendered, so this is the one test that proves
 * the whole pipeline — component source, registry generation, prerender, HTTP,
 * install — actually works. The unit tests check the registry's shape in
 * memory; only this checks that what gets deployed can be installed from.
 */

const CLI = resolve(dirname(fileURLToPath(import.meta.url)), '../cli/index.js');
// Includes the base path the site is deployed under, because that is what the
// CLI's own default carries — a registry URL that worked here without it would
// be testing an address nobody is ever served from.
const REGISTRY = 'http://localhost:4173/fajr-ui/r';

function project() {
	const dir = mkdtempSync(join(tmpdir(), 'fajr-e2e-'));
	writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'consumer' }));
	return dir;
}

const run = (cwd: string, ...args: string[]) =>
	execFileSync('node', [CLI, ...args], {
		cwd,
		encoding: 'utf8',
		// NO_COLOR so assertions match plain text rather than escape codes.
		// FORCE_COLOR is dropped rather than left set: Node warns when both are
		// present, and Playwright sets it for its own reporter.
		env: { ...process.env, FORCE_COLOR: undefined, NO_COLOR: '1', FAJR_UI_REGISTRY: REGISTRY }
	});

test('init writes a config pointing at a schema that exists', async ({ request }) => {
	const dir = project();
	run(dir, 'init', '-y');

	const config = JSON.parse(readFileSync(join(dir, 'fajr-ui.json'), 'utf8'));
	expect(config.aliases.components).toBeTruthy();
	expect(config.aliases.lib).toBeTruthy();

	// The `$schema` key used to point at a URL that had never been served, so
	// every generated config carried a dead reference.
	const schema = await request.get(config.$schema);
	expect(schema.ok()).toBe(true);
	expect((await schema.json()).title).toContain('Fajr UI');
});

test('add installs a component and everything it composes', () => {
	const dir = project();
	run(dir, 'init', '-y');
	const output = run(dir, 'add', 'calendar');

	expect(output).toContain('added');
	// Calendar composes Button, which composes Spinner. Neither was asked for.
	expect(existsSync(join(dir, 'src/lib/components/ui/calendar.svelte'))).toBe(true);
	expect(existsSync(join(dir, 'src/lib/components/ui/button.svelte'))).toBe(true);
	// And the helpers it imports as `$lib/utils`, or the first line would fail.
	expect(existsSync(join(dir, 'src/lib/utils.ts'))).toBe(true);
});

test('add honours both aliases independently', () => {
	// The bug this covers: helper paths were relative to the component directory,
	// so moving components out of `$lib/components/ui` wrote `$lib/utils` to
	// somewhere no import could reach.
	const dir = project();
	run(dir, 'init', '-y');
	const config = JSON.parse(readFileSync(join(dir, 'fajr-ui.json'), 'utf8'));
	config.aliases = { components: 'src/components/ui', lib: 'src/lib' };
	writeFileSync(join(dir, 'fajr-ui.json'), JSON.stringify(config));

	run(dir, 'add', 'calendar');
	expect(existsSync(join(dir, 'src/components/ui/calendar.svelte'))).toBe(true);
	expect(existsSync(join(dir, 'src/lib/utils.ts'))).toBe(true);
	expect(existsSync(join(dir, 'src/utils.ts'))).toBe(false);
});

test('add names the install command in the project’s own package manager', () => {
	const dir = project();
	writeFileSync(join(dir, 'yarn.lock'), '');
	run(dir, 'init', '-y');
	expect(run(dir, 'add', 'calendar')).toContain('yarn add');
});

test('a second add changes nothing', () => {
	// `add` has to be idempotent, or re-running it after a failure is unsafe.
	const dir = project();
	run(dir, 'init', '-y');
	run(dir, 'add', 'button');
	const before = readFileSync(join(dir, 'src/lib/components/ui/button.svelte'), 'utf8');

	run(dir, 'add', 'button');
	expect(readFileSync(join(dir, 'src/lib/components/ui/button.svelte'), 'utf8')).toBe(before);
});

test('update leaves a file you have edited alone', () => {
	const dir = project();
	run(dir, 'init', '-y');
	run(dir, 'add', 'button');

	const path = join(dir, 'src/lib/components/ui/button.svelte');
	const edited = `${readFileSync(path, 'utf8')}\n<!-- mine -->\n`;
	writeFileSync(path, edited);

	expect(run(dir, 'outdated')).toContain('edited locally');
	expect(run(dir, 'diff')).toContain('mine');

	const output = run(dir, 'update');
	expect(output).toContain('kept');
	// The whole promise of components you own: this is still there.
	expect(readFileSync(path, 'utf8')).toBe(edited);
});

test('--force replaces an edited file, and only then', () => {
	const dir = project();
	run(dir, 'init', '-y');
	run(dir, 'add', 'button');

	const path = join(dir, 'src/lib/components/ui/button.svelte');
	writeFileSync(path, `${readFileSync(path, 'utf8')}\n<!-- mine -->\n`);
	run(dir, 'update', '--force');
	expect(readFileSync(path, 'utf8')).not.toContain('mine');
});

test('--dry-run writes nothing', () => {
	const dir = project();
	run(dir, 'init', '-y');
	run(dir, 'add', 'button', '--dry-run');
	expect(existsSync(join(dir, 'src/lib/components/ui/button.svelte'))).toBe(false);
});

test('installed components import nothing the install did not provide', () => {
	// A relative import that resolves to no file on disk means the component was
	// shipped without a piece it composes — which only shows up when the user
	// tries to build.
	const dir = project();
	run(dir, 'init', '-y');
	run(dir, 'add', 'data-table', 'date-picker', 'command', 'sidebar');

	const root = join(dir, 'src/lib/components/ui');
	const files = JSON.parse(readFileSync(join(dir, 'fajr-ui.lock.json'), 'utf8'));
	const dangling: string[] = [];

	for (const item of Object.values(files.items) as { files: Record<string, string> }[]) {
		for (const key of Object.keys(item.files)) {
			const [rootName, ...rest] = key.split('/');
			const from = join(rootName === 'lib' ? join(dir, 'src/lib') : root, rest.join('/'));
			const source = readFileSync(from, 'utf8');
			for (const [, specifier] of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
				const target = resolve(dirname(from), specifier);
				const found = [target, `${target}.ts`, `${target}.svelte`, join(target, 'index.ts')].some(
					(candidate) => existsSync(candidate)
				);
				if (!found) dangling.push(`${key} → ${specifier}`);
			}
		}
	}
	expect(dangling).toEqual([]);
});

test('list marks what is installed', () => {
	const dir = project();
	run(dir, 'init', '-y');
	run(dir, 'add', 'button');
	const output = run(dir, 'list');
	expect(output).toMatch(/button\s+installed/);
	expect(output).toContain('components.');
});

test('a component that does not exist fails without writing anything', () => {
	const dir = project();
	run(dir, 'init', '-y');
	expect(() => run(dir, 'add', 'not-a-component')).toThrow();
	expect(existsSync(join(dir, 'src'))).toBe(false);
});

test('skill writes the agent instructions and refreshes them in place', () => {
	const dir = project();
	run(dir, 'init', '-y');
	writeFileSync(join(dir, 'AGENTS.md'), '# My project\n\nSomething I wrote.\n');

	run(dir, 'skill');
	let agents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
	expect(agents).toContain('Something I wrote.');
	expect(agents).toContain('fajr-ui:start');
	expect(existsSync(join(dir, '.claude/skills/fajr-ui/SKILL.md'))).toBe(true);

	// Twice must not stack two copies of the block.
	run(dir, 'skill');
	agents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
	expect(agents.match(/fajr-ui:start/g)).toHaveLength(1);
	expect(agents).toContain('Something I wrote.');
});
