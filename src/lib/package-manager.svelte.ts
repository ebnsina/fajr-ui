import { browser } from '$app/environment';

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

const STORAGE_KEY = 'fajr-ui-package-manager';

/**
 * Which package manager the documentation's commands are written for.
 *
 * Kept in `localStorage` so it is chosen once rather than on every page. There
 * is no server-side default to match, because the choice only ever changes the
 * text of a command — never what renders — so a mismatch on first paint costs
 * nothing but a word.
 */
class PackageManagerState {
	current = $state<PackageManager>('pnpm');

	constructor() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (PACKAGE_MANAGERS.includes(stored as PackageManager)) {
			this.current = stored as PackageManager;
		}
	}

	set(manager: PackageManager): void {
		this.current = manager;
		if (browser) localStorage.setItem(STORAGE_KEY, manager);
	}
}

export const packageManager = new PackageManagerState();

/** `pnpm add x` in whichever dialect. */
export function addCommand(packages: string[], manager: PackageManager): string {
	const list = packages.join(' ');
	// npm is the odd one: `install` rather than `add`.
	if (manager === 'npm') return `npm install ${list}`;
	return `${manager} add ${list}`;
}

/**
 * Run a package's binary without installing it first.
 *
 * Every manager spells this differently, and getting it wrong is the kind of
 * error someone pastes into a terminal before noticing.
 */
export function execCommand(command: string, manager: PackageManager): string {
	switch (manager) {
		case 'npm':
			return `npx ${command}`;
		case 'pnpm':
			return `pnpm dlx ${command}`;
		case 'yarn':
			return `yarn dlx ${command}`;
		case 'bun':
			return `bunx ${command}`;
	}
}
