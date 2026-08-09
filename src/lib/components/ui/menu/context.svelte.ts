import { getContext, setContext } from 'svelte';

type MenuInit = {
	close: () => void;
	/** The panel element, once it exists. */
	panel: () => HTMLElement | null;
};

/** Every item role a menu can contain. */
const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

export class MenuState {
	#init: MenuInit;
	#typeahead = '';
	#typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

	constructor(init: MenuInit) {
		this.#init = init;
	}

	close(): void {
		this.#init.close();
	}

	/**
	 * Read from the DOM rather than a registry: items are inherently ordered by
	 * document position, and groups or conditionals can reorder them at any time.
	 * Disabled items are filtered out so they are skipped rather than focused.
	 */
	#items(): HTMLElement[] {
		const panel = this.#init.panel();
		if (!panel) return [];
		return [...panel.querySelectorAll<HTMLElement>(ITEM_SELECTOR)].filter(
			(item) => item.getAttribute('aria-disabled') !== 'true'
		);
	}

	focusFirst(): void {
		this.#items()[0]?.focus();
	}

	focusLast(): void {
		const items = this.#items();
		items[items.length - 1]?.focus();
	}

	/** Wraps at both ends, which is what a menu is expected to do. */
	move(delta: number): void {
		const items = this.#items();
		if (items.length === 0) return;
		const index = items.indexOf(document.activeElement as HTMLElement);
		const next = index === -1 ? 0 : (index + delta + items.length) % items.length;
		items[next]?.focus();
	}

	/**
	 * Typing jumps to the next item starting with what was typed. The buffer
	 * clears after a pause, so typing "s", waiting, then "e" searches for "e"
	 * rather than "se".
	 */
	typeahead(key: string): boolean {
		if (key.length !== 1 || !/\S/.test(key)) return false;

		clearTimeout(this.#typeaheadTimer);
		this.#typeahead += key.toLowerCase();
		this.#typeaheadTimer = setTimeout(() => (this.#typeahead = ''), 500);

		const items = this.#items();
		const current = items.indexOf(document.activeElement as HTMLElement);

		// Start after the current item so repeated keys cycle through matches.
		const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
		const match = ordered.find((item) =>
			(item.textContent ?? '').trim().toLowerCase().startsWith(this.#typeahead)
		);

		match?.focus();
		return Boolean(match);
	}
}

const MENU_CONTEXT_KEY = Symbol('menu');

export function setMenuContext(state: MenuState): MenuState {
	return setContext(MENU_CONTEXT_KEY, state);
}

export function useMenu(): MenuState {
	const state = getContext<MenuState | undefined>(MENU_CONTEXT_KEY);
	if (!state) throw new Error('Menu parts must be used within <Menu>.');
	return state;
}
