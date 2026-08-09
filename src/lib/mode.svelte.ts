import { browser } from '$app/environment';

export type Mode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'fajr-ui-mode';

/**
 * Theme state, mirrored to `localStorage` and to the `.dark` class the theme
 * tokens key off. The initial class is set by an inline script in `app.html`,
 * so there is no flash before hydration.
 */
class ModeState {
	current = $state<Mode>('system');

	constructor() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark' || stored === 'system') this.current = stored;
	}

	get resolved(): 'light' | 'dark' {
		if (this.current !== 'system') return this.current;
		if (!browser) return 'light';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	set(mode: Mode): void {
		this.current = mode;
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, mode);
		document.documentElement.classList.toggle('dark', this.resolved === 'dark');
	}

	toggle(): void {
		this.set(this.resolved === 'dark' ? 'light' : 'dark');
	}
}

export const mode = new ModeState();
