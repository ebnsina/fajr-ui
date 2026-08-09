/**
 * The exact version of every third-party package a component was built and
 * verified against.
 *
 * Why exact, and why here:
 *
 * The registry tells the CLI which packages a component needs. Without a
 * version that instruction is `pnpm add @tanstack/charts`, which resolves to
 * whatever is latest on the day someone runs it — and several of these are
 * pre-1.0, where a minor bump is allowed to break the API and regularly does.
 * TanStack Charts published nineteen versions before 0.7.2 and describes itself
 * as pre-alpha; installing "latest" against components written for 0.7.2 is a
 * broken build waiting for a Tuesday.
 *
 * So the registry emits `package@version`, the CLI passes that straight to the
 * package manager, and a fresh install reproduces exactly what was tested. Our
 * own `package.json` pins the same versions with no caret, so this file and the
 * lockfile cannot drift apart — `pnpm check:versions` fails the build if they do.
 *
 * Upgrading is deliberate: bump the version here and in `package.json`, run the
 * site, and confirm the components still render. That is the whole point — the
 * upgrade happens when someone is watching.
 */
export const PINNED: Record<string, string> = {
	'@tanstack/charts': '0.7.2',
	'@tanstack/charts-scales': '0.7.2',
	'@tanstack/svelte-charts': '0.7.2',
	'@tanstack/svelte-table': '9.0.0',
	'@tanstack/highlight': '0.0.10',
	'@tanstack/pacer': '0.21.1',
	'@hugeicons/core-free-icons': '4.2.3',
	'@hugeicons/svelte': '1.1.4',
	'class-variance-authority': '0.7.1',
	clsx: '2.1.1',
	'tailwind-merge': '3.6.0'
};

/**
 * `@tanstack/charts/tooltip` and the like resolve to their owning package, so a
 * subpath import still finds its pin.
 */
export function packageOf(specifier: string): string {
	const parts = specifier.split('/');
	return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

/** `@tanstack/charts` → `@tanstack/charts@0.7.2`, or unchanged if unpinned. */
export function pinned(name: string): string {
	const version = PINNED[name];
	return version ? `${name}@${version}` : name;
}
