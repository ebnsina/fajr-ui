#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import { addCommand, hash, keyOf, packageManager, rootsOf, statusOf, unifiedDiff } from './lib.js';

const DEFAULT_REGISTRY = process.env.FAJR_UI_REGISTRY ?? 'https://fajr-ui.dev/r';
const CONFIG_FILE = 'fajr-ui.json';
const LOCK_FILE = 'fajr-ui.lock.json';

/*
 * Colour, unless the output is not a terminal or the user has asked for none.
 *
 * Escape codes in a redirected log or a CI transcript are noise at best, and
 * they defeat anything that greps the output. NO_COLOR is the agreed spelling;
 * FORCE_COLOR overrides the pipe check for when colour is wanted through one
 * anyway.
 */
const COLOUR = !process.env.NO_COLOR && (process.env.FORCE_COLOR ? true : Boolean(stdout.isTTY));

const colour = (code) => (value) => (COLOUR ? `[${code}m${value}[0m` : String(value));
const dim = colour(2);
const bold = colour(1);
const green = colour(32);
const red = colour(31);
const yellow = colour(33);
const cyan = colour(36);

function fail(message) {
	console.error(`${red('error')} ${message}`);
	process.exit(1);
}

async function readJson(path, fallback) {
	if (!existsSync(path)) return fallback;
	return JSON.parse(await readFile(path, 'utf8'));
}

async function readConfig(cwd) {
	const config = await readJson(join(cwd, CONFIG_FILE), null);
	if (!config) fail(`No ${CONFIG_FILE} found. Run ${cyan('npx fajr-ui init')} first.`);
	return config;
}

const readLock = (cwd) => readJson(join(cwd, LOCK_FILE), { items: {} });

async function writeLock(cwd, lock) {
	await writeFile(join(cwd, LOCK_FILE), `${JSON.stringify(lock, null, '\t')}\n`);
}

async function fetchItem(registry, name) {
	let response;
	try {
		response = await fetch(`${registry}/${name}.json`);
	} catch {
		return fail(`Could not reach the registry at ${registry}.`);
	}
	if (response.status === 404) fail(`Unknown component "${name}".`);
	if (!response.ok) fail(`Registry returned ${response.status} for "${name}".`);
	return response.json();
}

/**
 * Walks `registryDependencies` so asking for one component brings the pieces it
 * composes with it. Visited names are tracked because the graph has diamonds —
 * half the library imports Button.
 */
async function collect(registry, names, seen = new Map()) {
	for (const name of names) {
		if (seen.has(name)) continue;
		const item = await fetchItem(registry, name);
		seen.set(name, item);
		await collect(registry, item.registryDependencies ?? [], seen);
	}
	return seen;
}

async function confirm(question) {
	if (!stdin.isTTY) return false;
	const rl = createInterface({ input: stdin, output: stdout });
	const answer = await rl.question(`${question} ${dim('(y/N)')} `);
	rl.close();
	return /^y(es)?$/i.test(answer.trim());
}

/**
 * Classifies every file of an item against what is on disk and what the lock
 * recorded. Every command below decides from this.
 */
async function inspect(cwd, config, item, lock) {
	const roots = rootsOf(cwd, config);
	const recorded = lock.items?.[item.name]?.files ?? {};
	const results = [];

	for (const file of item.files) {
		const key = keyOf(file);
		const target = resolve(roots[file.root ?? 'components'], file.path);
		const upstream = hash(file.content);
		const known = recorded[key];
		const present = existsSync(target);
		const local = present ? await readFile(target, 'utf8') : null;
		const current = present ? hash(local) : null;

		const status = statusOf({ present, current, upstream, known });

		// Reported as the path on disk rather than the registry's own, so what is
		// printed is what you would open.
		const display = relative(cwd, target);
		results.push({ ...file, key, target, display, upstream, current, local, status });
	}
	return results;
}

function summarise(files) {
	const counts = { current: 0, outdated: 0, modified: 0, missing: 0 };
	for (const file of files) counts[file.status]++;
	return counts;
}

async function applyFiles(files, { overwriteModified }) {
	const written = [];
	const kept = [];
	for (const file of files) {
		if (file.status === 'current') continue;
		if (file.status === 'modified' && !overwriteModified) {
			kept.push(file);
			continue;
		}
		await mkdir(dirname(file.target), { recursive: true });
		await writeFile(file.target, file.content);
		written.push(file);
	}
	return { written, kept };
}

function recordLock(lock, item, files, written) {
	lock.items ??= {};
	const previous = lock.items[item.name]?.files ?? {};
	const wrote = new Set(written.map((file) => file.key));
	const entry = { installedAt: new Date().toISOString(), files: {} };

	for (const file of files) {
		/*
		 * The lock records the hash of the content this CLI last *wrote*, never
		 * what happens to be on disk. Adopting the user's edit as the baseline
		 * would make the file look merely outdated on the next run, and the run
		 * after that would overwrite it without warning.
		 */
		entry.files[file.key] = wrote.has(file.key)
			? file.upstream
			: (previous[file.key] ?? file.upstream);
	}

	lock.items[item.name] = { ...lock.items[item.name], ...entry };
	return lock;
}

async function init(cwd, args) {
	const yes = args.includes('--yes') || args.includes('-y');
	const path = join(cwd, CONFIG_FILE);
	if (existsSync(path) && !yes && !(await confirm(`${CONFIG_FILE} exists. Overwrite?`))) return;

	const config = {
		$schema: `${DEFAULT_REGISTRY}/schema.json`,
		registry: DEFAULT_REGISTRY,
		aliases: { components: 'src/lib/components/ui', lib: 'src/lib' }
	};
	await writeFile(path, `${JSON.stringify(config, null, '\t')}\n`);
	console.log(`${green('added')} ${bold(CONFIG_FILE)}`);
	console.log();
	console.log(`  Components will be written to ${cyan(config.aliases.components)}.`);
	console.log(`  Add one with ${cyan('npx fajr-ui add button')}.`);
	console.log();
}

async function add(cwd, args) {
	const names = args.filter((arg) => !arg.startsWith('-'));
	if (names.length === 0) fail('Name at least one component, e.g. `fajr-ui add button`.');

	const force = args.includes('--force');
	const dryRun = args.includes('--dry-run');
	const config = await readConfig(cwd);
	const registry = config.registry ?? DEFAULT_REGISTRY;
	const lock = await readLock(cwd);

	const items = await collect(registry, names);
	const requested = new Set(names);
	const packages = new Set();
	const blocked = [];
	let totalWritten = 0;

	for (const item of items.values()) {
		for (const dependency of item.dependencies ?? []) packages.add(dependency);
		const files = await inspect(cwd, config, item, lock);

		if (dryRun) {
			const counts = summarise(files);
			console.log(
				`  ${bold(item.name.padEnd(18))} ${dim(
					`${counts.missing} new, ${counts.outdated} to update, ${counts.modified} edited locally`
				)}`
			);
			continue;
		}

		const { written, kept } = await applyFiles(files, { overwriteModified: force });
		totalWritten += written.length;
		blocked.push(...kept.map((file) => file.display));
		recordLock(lock, item, files, written);
	}

	if (dryRun) {
		console.log();
		console.log(`  ${dim('Nothing written — this was a dry run.')}`);
		console.log();
		return;
	}

	await writeLock(cwd, lock);

	const pulled = [...items.keys()].filter((name) => !requested.has(name));
	console.log();
	console.log(`${green('added')} ${totalWritten} file${totalWritten === 1 ? '' : 's'}`);
	if (pulled.length) {
		console.log(`  ${dim('Also added, because the above compose them:')} ${pulled.join(', ')}`);
	}
	if (blocked.length) {
		console.log();
		console.log(`${yellow('kept')} ${blocked.length} file(s) you have edited:`);
		for (const path of blocked) console.log(`  ${dim(path)}`);
		console.log(
			`  ${dim('Review with')} ${cyan('npx fajr-ui diff')} ${dim('or replace with --force.')}`
		);
	}
	if (packages.size) {
		console.log();
		console.log(`  ${bold('Install the packages these need:')}`);
		console.log(`  ${cyan(addCommand(packageManager(cwd), [...packages].sort()))}`);
		// The versions are exact on purpose — some of these are pre-1.0, where a
		// minor release may change the API. This installs what the component was
		// built and tested against rather than whatever is latest today.
		console.log(`  ${dim('Versions are pinned to what these components were built against.')}`);
	}
	console.log();
}

/** What has changed upstream since you installed, and what you have edited. */
async function outdated(cwd, args) {
	const config = await readConfig(cwd);
	const registry = config.registry ?? DEFAULT_REGISTRY;
	const lock = await readLock(cwd);
	const names = args.filter((arg) => !arg.startsWith('-'));
	const installed = names.length ? names : Object.keys(lock.items ?? {});

	if (installed.length === 0) {
		console.log(`\n  ${dim('Nothing installed yet.')}\n`);
		return;
	}

	console.log();
	let stale = 0;
	let edited = 0;
	for (const name of installed) {
		const item = await fetchItem(registry, name);
		const counts = summarise(await inspect(cwd, config, item, lock));
		const parts = [];
		if (counts.outdated) parts.push(yellow(`${counts.outdated} outdated`));
		if (counts.missing) parts.push(cyan(`${counts.missing} missing`));
		if (counts.modified) parts.push(dim(`${counts.modified} edited locally`));
		stale += counts.outdated + counts.missing;
		edited += counts.modified;
		console.log(
			`  ${bold(name.padEnd(18))} ${parts.length ? parts.join(dim(' · ')) : green('up to date')}`
		);
	}
	console.log();
	if (stale) console.log(`  ${dim('Update with')} ${cyan('npx fajr-ui update')}${dim('.')}`);
	if (edited) console.log(`  ${dim('Your edits are never replaced without --force.')}`);
	console.log();
}

async function diff(cwd, args) {
	const config = await readConfig(cwd);
	const registry = config.registry ?? DEFAULT_REGISTRY;
	const lock = await readLock(cwd);
	const names = args.filter((arg) => !arg.startsWith('-'));
	const installed = names.length ? names : Object.keys(lock.items ?? {});

	let shown = 0;
	for (const name of installed) {
		const item = await fetchItem(registry, name);
		for (const file of await inspect(cwd, config, item, lock)) {
			if (file.status === 'current' || file.status === 'missing') continue;
			const text = unifiedDiff(file.local ?? '', file.content, file.display, {
				add: green,
				del: red,
				ctx: dim,
				head: bold
			});
			if (!text) continue;
			console.log();
			console.log(text);
			shown++;
		}
	}
	console.log();
	console.log(
		shown ? `  ${shown} file(s) differ.` : `  ${green('Everything matches the registry.')}`
	);
	console.log();
}

async function update(cwd, args) {
	const config = await readConfig(cwd);
	const registry = config.registry ?? DEFAULT_REGISTRY;
	const lock = await readLock(cwd);
	const force = args.includes('--force');
	const dryRun = args.includes('--dry-run');
	const names = args.filter((arg) => !arg.startsWith('-'));
	const installed = names.length ? names : Object.keys(lock.items ?? {});

	if (installed.length === 0) {
		console.log(`\n  ${dim('Nothing installed yet.')}\n`);
		return;
	}

	const updated = [];
	const blocked = [];
	for (const name of installed) {
		const item = await fetchItem(registry, name);
		const files = await inspect(cwd, config, item, lock);

		if (dryRun) {
			for (const file of files) {
				if (file.status === 'outdated' || file.status === 'missing') {
					updated.push(file.display);
				} else if (file.status === 'modified') {
					(force ? updated : blocked).push(file.display);
				}
			}
			continue;
		}

		const { written, kept } = await applyFiles(files, { overwriteModified: force });
		updated.push(...written.map((file) => file.display));
		blocked.push(...kept.map((file) => file.display));
		recordLock(lock, item, files, written);
	}

	if (!dryRun) await writeLock(cwd, lock);

	console.log();
	if (updated.length) {
		console.log(`${green(dryRun ? 'would update' : 'updated')} ${updated.length} file(s)`);
		for (const path of updated) console.log(`  ${dim(path)}`);
	} else {
		console.log(`  ${green('Everything is already up to date.')}`);
	}
	if (blocked.length) {
		console.log();
		console.log(`${yellow('kept')} ${blocked.length} file(s) you have edited:`);
		for (const path of blocked) console.log(`  ${dim(path)}`);
		console.log();
		console.log(`  ${dim('Left exactly as they are. See what changed upstream with')}`);
		console.log(
			`  ${cyan('npx fajr-ui diff')}${dim(', then merge by hand or take theirs with --force.')}`
		);
	}
	console.log();
}

async function list(cwd, args) {
	const override = args.find((arg) => arg.startsWith('--registry='));
	const registry = override
		? override.slice('--registry='.length)
		: existsSync(join(cwd, CONFIG_FILE))
			? ((await readConfig(cwd)).registry ?? DEFAULT_REGISTRY)
			: DEFAULT_REGISTRY;

	const response = await fetch(`${registry}/index.json`).catch(() => null);
	if (!response?.ok) fail(`Could not read the registry at ${registry}.`);
	const { items } = await response.json();
	const lock = await readLock(cwd);

	console.log();
	for (const item of items) {
		const mark = lock.items?.[item.name] ? green('installed') : dim('-');
		console.log(`  ${bold(item.name.padEnd(18))} ${mark.padEnd(22)} ${dim(item.description)}`);
	}
	console.log();
	console.log(`  ${items.length} components.`);
	console.log();
}

/**
 * Writes the agent instructions into the project, so a coding agent working
 * here knows the rules without being told them every session.
 *
 * Both files are fetched rather than bundled, so they stay in step with the
 * registry the project is actually pointed at. AGENTS.md is edited between
 * markers rather than overwritten — it is a file the user owns and usually has
 * other things in.
 */
async function skill(cwd, args) {
	const override = args.find((arg) => arg.startsWith('--registry='));
	const registry = override
		? override.slice('--registry='.length)
		: existsSync(join(cwd, CONFIG_FILE))
			? ((await readConfig(cwd)).registry ?? DEFAULT_REGISTRY)
			: DEFAULT_REGISTRY;
	// The docs live at the registry's parent, not under /r.
	const site = registry.replace(/\/r\/?$/, '');

	const get = async (path) => {
		const response = await fetch(`${site}${path}`).catch(() => null);
		if (!response?.ok) fail(`Could not read ${site}${path}.`);
		return response.text();
	};

	const written = [];

	const skillPath = join(cwd, '.claude', 'skills', 'fajr-ui', 'SKILL.md');
	await mkdir(dirname(skillPath), { recursive: true });
	await writeFile(skillPath, await get('/skill.md'), 'utf8');
	written.push('.claude/skills/fajr-ui/SKILL.md');

	const block = await get('/agents.md');
	const agentsPath = join(cwd, 'AGENTS.md');
	const existing = existsSync(agentsPath) ? await readFile(agentsPath, 'utf8') : '';
	const START = '<!-- fajr-ui:start -->';
	const END = '<!-- fajr-ui:end -->';
	let next;
	if (existing.includes(START) && existing.includes(END)) {
		// Refresh in place; everything the user wrote around it is untouched.
		next =
			existing.slice(0, existing.indexOf(START)) +
			block +
			existing.slice(existing.indexOf(END) + END.length);
	} else {
		next = existing ? `${existing.replace(/\s+$/, '')}\n\n${block}\n` : `${block}\n`;
	}
	await writeFile(agentsPath, next, 'utf8');
	written.push(existing.includes(START) ? 'AGENTS.md (refreshed)' : 'AGENTS.md');

	console.log();
	console.log(`${green('wrote')} ${written.length} file${written.length === 1 ? '' : 's'}`);
	for (const path of written) console.log(`  ${dim(path)}`);
	console.log();
	console.log(
		`  ${dim('Component docs an agent can fetch:')} ${cyan(`${site}/docs/components/<slug>.md`)}`
	);
	console.log(`  ${dim('Everything in one file:')} ${cyan(`${site}/llms.txt`)}`);
	console.log();
}

function help() {
	console.log(`
  ${bold('fajr-ui')} - components you own, kept up to date

  ${bold('Usage')}
    npx fajr-ui <command> [options]

  ${bold('Commands')}
    init                 Write ${CONFIG_FILE} with the paths to install into
    add <name...>        Copy components in, with whatever they compose
    list                 Show every component, and which you have installed
    outdated [name...]   Show what has changed upstream since you installed
    diff [name...]       Show those changes line by line
    update [name...]     Apply them, leaving files you have edited alone
    skill                Write the agent instructions into this project

  ${bold('Options')}
    --dry-run            Report what would happen, write nothing
    --force              Replace files you have edited too
    -y, --yes            Skip prompts
    --registry=<url>     Read from a different registry
    -v, --version        Print the version

  ${bold('Keeping your edits')}
    These components are yours to change, so the CLI records a hash of each file
    as it writes it. An update replaces only files still matching that hash;
    anything you have touched is reported and left alone until you say otherwise.

  ${bold('Examples')}
    npx fajr-ui init
    npx fajr-ui add button dialog
    npx fajr-ui outdated
    npx fajr-ui diff button
    npx fajr-ui update --dry-run
    npx fajr-ui skill
`);
}

/** Read from this package's own manifest, so there is one place to bump. */
async function version() {
	const here = dirname(fileURLToPath(import.meta.url));
	const { version } = JSON.parse(await readFile(join(here, 'package.json'), 'utf8'));
	console.log(version);
}

const [command, ...args] = process.argv.slice(2);
const cwd = process.cwd();

try {
	if (command === '--version' || command === '-v' || command === 'version') await version();
	else if (command === 'init') await init(cwd, args);
	else if (command === 'add') await add(cwd, args);
	else if (command === 'list') await list(cwd, args);
	else if (command === 'outdated' || command === 'check') await outdated(cwd, args);
	else if (command === 'diff') await diff(cwd, args);
	else if (command === 'update' || command === 'upgrade') await update(cwd, args);
	else if (command === 'skill' || command === 'agents') await skill(cwd, args);
	else help();
} catch (error) {
	fail(error instanceof Error ? error.message : String(error));
}
