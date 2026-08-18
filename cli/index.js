#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
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

const DEFAULT_REGISTRY = process.env.FAJR_UI_REGISTRY ?? 'https://ebnsina.github.io/fajr-ui/r';
const CONFIG_FILE = 'fajr-ui.json';
const LOCK_FILE = 'fajr-ui.lock.json';

/**
 * The registry item holding the design tokens. Named rather than inlined
 * because `init` installs it and `add` checks for it, and those two agreeing is
 * the whole point.
 */
const THEME_ITEM = 'theme';

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

/*
 * A spinner, and the conditions under which there should not be one.
 *
 * Every command here spends its time on the network — resolving a component's
 * dependency graph is one request per item — and until now that time was spent
 * in silence, which reads as a hang. The animation is a terminal affordance
 * though: written to a pipe it is thousands of carriage returns, and in CI it
 * is thousands of log lines. Both fall back to a single static line, so the
 * transcript still says what was happening without redrawing it.
 *
 * Frames are erased rather than left behind. What the command has to say is
 * said by the summary it prints afterwards.
 */
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const ANIMATE = Boolean(stdout.isTTY) && !process.env.CI && !process.env.NO_COLOR;

// The one in flight, so an error can wipe it before printing over the top.
let spinning = null;

function spinner(text) {
	if (!ANIMATE) {
		console.log(`  ${text}…`);
		return { update() {}, stop() {} };
	}

	let label = text;
	let frame = 0;

	const draw = () => {
		// Carriage return and erase-line: no scrollback for a transient state.
		stdout.write(`\r[2K  ${cyan(FRAMES[frame])} ${label}`);
		frame = (frame + 1) % FRAMES.length;
	};

	stdout.write('[?25l');
	draw();
	const timer = setInterval(draw, 80);
	// Unreferenced so a forgotten spinner cannot be the reason the process stays
	// alive — the worst case is a stray line, not a CLI that never exits.
	timer.unref();

	const handle = {
		update(next) {
			label = next;
		},
		stop() {
			if (spinning !== handle) return;
			clearInterval(timer);
			stdout.write('\r[2K[?25h');
			spinning = null;
		}
	};
	spinning = handle;
	return handle;
}

// Ctrl-C mid-spin would otherwise leave the cursor hidden in the user's shell.
process.on('SIGINT', () => {
	spinning?.stop();
	process.exit(130);
});

function fail(message) {
	spinning?.stop();
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
async function collect(registry, names, seen = new Map(), onFetch) {
	for (const name of names) {
		if (seen.has(name)) continue;
		onFetch?.(name, seen.size);
		const item = await fetchItem(registry, name);
		seen.set(name, item);
		await collect(registry, item.registryDependencies ?? [], seen, onFetch);
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

/**
 * Whether the token stylesheet is in place.
 *
 * Checks the path `init` writes to, and nothing cleverer. A project that moved
 * the file or brought its own tokens under another name will be told once that
 * they are missing, which is a great deal better than the alternative failure:
 * silence, and a component whose borders are the wrong colour for reasons that
 * lead nowhere.
 */
function hasTheme(cwd, config) {
	return existsSync(resolve(rootsOf(cwd, config).lib, 'styles/theme.css'));
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

	/*
	 * The tokens are installed here rather than left as a step in the docs.
	 * Every component reads `--border`, `--input` and `--ring` with no fallback
	 * of its own, so a project that added a component without them got borders
	 * in their own text colour — Preflight's `currentColor` default showing
	 * through. That failure names nothing that would lead you back to a missing
	 * stylesheet, so the CLI stopped relying on anyone reading the instruction.
	 */
	const lock = await readLock(cwd);
	const item = await fetchItem(config.registry, THEME_ITEM);
	const files = await inspect(cwd, config, item, lock);
	const { written, kept } = await applyFiles(files, { overwriteModified: false });
	recordLock(lock, item, files, written);
	await writeLock(cwd, lock);

	for (const file of written) console.log(`${green('added')} ${bold(file.display)}`);
	for (const file of kept) console.log(`${dim('kept')}  ${bold(file.display)} ${dim('(edited)')}`);

	const themeFile = files[0];
	console.log();
	console.log(`  Components will be written to ${cyan(config.aliases.components)}.`);
	console.log();
	console.log(`  Import the tokens after Tailwind, in your app's stylesheet:`);
	console.log();
	console.log(`    ${dim("@import 'tailwindcss';")}`);
	console.log(`    ${cyan(`@import './${themeFile.display.replace(/^src\//, '')}';`)}`);
	console.log();
	console.log(`  Then add a component with ${cyan('npx fajr-ui add button')}.`);
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

	const started = Date.now();
	const spin = spinner(`Resolving ${names.join(', ')}`);

	// The dependency graph is walked one request at a time, so the count is what
	// says the CLI is making progress rather than stuck on a slow response.
	const items = await collect(registry, names, new Map(), (name, done) =>
		spin.update(`Resolving ${bold(name)}${done ? dim(` · ${done} fetched`) : ''}`)
	);

	const requested = new Set(names);
	const packages = new Set();
	const blocked = [];
	const planned = [];
	let totalWritten = 0;

	for (const item of items.values()) {
		for (const dependency of item.dependencies ?? []) packages.add(dependency);
		spin.update(`${dryRun ? 'Checking' : 'Writing'} ${bold(item.name)}`);
		const files = await inspect(cwd, config, item, lock);

		if (dryRun) {
			// Held rather than printed: a line written now would land in the middle
			// of the spinner's own line and be erased by the next frame.
			const counts = summarise(files);
			planned.push(
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

	spin.stop();

	if (dryRun) {
		for (const line of planned) console.log(line);
		console.log();
		console.log(`  ${dim('Nothing written — this was a dry run.')}`);
		console.log();
		return;
	}

	await writeLock(cwd, lock);

	const pulled = [...items.keys()].filter((name) => !requested.has(name));
	console.log();
	console.log(
		`${green('added')} ${totalWritten} file${totalWritten === 1 ? '' : 's'} ${dim(`from ${items.size} component${items.size === 1 ? '' : 's'} in ${elapsed(started)}`)}`
	);
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

	/*
	 * Said here because the symptom does not point at the cause. Without the
	 * tokens the components still render — they just render with every border in
	 * the surrounding text colour, which reads as a broken component rather than
	 * as a missing stylesheet. Cheaper to say it than to have it debugged.
	 */
	if (!hasTheme(cwd, config)) {
		console.log();
		console.log(`${yellow('warning')} the design tokens are not installed.`);
		console.log(`  ${dim('Borders and focus rings will fall back to the current text colour.')}`);
		console.log(`  ${dim('Install them with')} ${cyan('npx fajr-ui add theme')}${dim('.')}`);
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

	// Every line is built before any is printed: one request per component, and
	// a half-drawn table interleaved with the spinner is worse than a wait.
	const spin = spinner('Checking components');
	const lines = [];
	let stale = 0;
	let edited = 0;
	for (const [index, name] of installed.entries()) {
		spin.update(`Checking ${bold(name)} ${dim(`· ${index + 1} of ${installed.length}`)}`);
		const item = await fetchItem(registry, name);
		const counts = summarise(await inspect(cwd, config, item, lock));
		const parts = [];
		if (counts.outdated) parts.push(yellow(`${counts.outdated} outdated`));
		if (counts.missing) parts.push(cyan(`${counts.missing} missing`));
		if (counts.modified) parts.push(dim(`${counts.modified} edited locally`));
		stale += counts.outdated + counts.missing;
		edited += counts.modified;
		lines.push(
			`  ${bold(name.padEnd(18))} ${parts.length ? parts.join(dim(' · ')) : green('up to date')}`
		);
	}
	spin.stop();

	console.log();
	for (const line of lines) console.log(line);
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

	const spin = spinner('Comparing against the registry');
	const diffs = [];
	for (const [index, name] of installed.entries()) {
		spin.update(`Comparing ${bold(name)} ${dim(`· ${index + 1} of ${installed.length}`)}`);
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
			diffs.push(text);
		}
	}
	spin.stop();

	const shown = diffs.length;
	for (const text of diffs) {
		console.log();
		console.log(text);
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

	const started = Date.now();
	const spin = spinner(dryRun ? 'Checking for updates' : 'Updating components');
	const updated = [];
	const blocked = [];
	for (const [index, name] of installed.entries()) {
		spin.update(
			`${dryRun ? 'Checking' : 'Updating'} ${bold(name)} ${dim(`· ${index + 1} of ${installed.length}`)}`
		);
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
	spin.stop();

	console.log();
	if (updated.length) {
		console.log(
			`${green(dryRun ? 'would update' : 'updated')} ${updated.length} file(s) ${dim(`in ${elapsed(started)}`)}`
		);
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

	const spin = spinner('Reading the registry');
	const response = await fetch(`${registry}/index.json`).catch(() => null);
	if (!response?.ok) fail(`Could not read the registry at ${registry}.`);
	const { items } = await response.json();
	const lock = await readLock(cwd);
	spin.stop();

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
	const spin = spinner(`Fetching the instructions from ${cyan(site)}`);

	const skillPath = join(cwd, '.claude', 'skills', 'fajr-ui', 'SKILL.md');
	await mkdir(dirname(skillPath), { recursive: true });
	await writeFile(skillPath, await get('/skill.md'), 'utf8');
	written.push('.claude/skills/fajr-ui/SKILL.md');

	spin.update('Writing AGENTS.md');
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
	spin.stop();

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
