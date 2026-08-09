import { getContext, setContext } from 'svelte';

type CommandInit = {
	query: () => string;
	setQuery: (query: string) => void;
	close: () => void;
	baseId: string;
};

export class CommandState {
	#init: CommandInit;
	/** The option pointed at by `aria-activedescendant`. */
	activeId = $state<string | undefined>();
	/** Set by CommandList; every option lookup reads from it. */
	list = $state<HTMLElement | null>(null);

	constructor(init: CommandInit) {
		this.#init = init;
	}

	get query(): string {
		return this.#init.query();
	}

	get listId(): string {
		return `${this.#init.baseId}-list`;
	}

	setQuery(query: string): void {
		this.#init.setQuery(query);
	}

	close(): void {
		this.#init.close();
	}

	/**
	 * The `key` the caller gave the active item, if any.
	 *
	 * Read from the DOM for the same reason the option list is: items are
	 * rendered as children and can be reordered by filtering at any moment, so
	 * what is on screen is the only ordering that counts. This is what lets a
	 * footer say something about whatever is currently highlighted.
	 */
	get activeKey(): string | undefined {
		if (!this.activeId) return undefined;
		return this.list?.querySelector<HTMLElement>(`#${CSS.escape(this.activeId)}`)?.dataset.key;
	}

	/** Case-insensitive substring over the label plus any hidden keywords. */
	matches(text: string): boolean {
		const query = this.query.trim().toLowerCase();
		return query === '' || text.toLowerCase().includes(query);
	}

	/**
	 * Read from the DOM rather than a registry. Items are rendered as children,
	 * so a group or conditional can reorder them at any time, and what is on
	 * screen is the only ordering that matters for the arrow keys.
	 */
	#options(): HTMLElement[] {
		return this.list ? [...this.list.querySelectorAll<HTMLElement>('[role="option"]')] : [];
	}

	/** Keeps the active option valid as filtering changes what is rendered. */
	sync(): void {
		const options = this.#options();
		if (options.length === 0) {
			this.activeId = undefined;
			return;
		}
		if (!options.some((option) => option.id === this.activeId)) {
			this.activeId = options[0].id;
		}
	}

	move(delta: number): void {
		const options = this.#options();
		if (options.length === 0) return;
		const index = options.findIndex((option) => option.id === this.activeId);
		const next = index === -1 ? 0 : (index + delta + options.length) % options.length;
		this.activeId = options[next].id;
		options[next].scrollIntoView({ block: 'nearest' });
	}

	first(): void {
		this.activeId = this.#options()[0]?.id;
	}

	last(): void {
		const options = this.#options();
		this.activeId = options[options.length - 1]?.id;
	}

	/** Activates whatever the keyboard is pointing at. */
	run(): void {
		const active = this.#options().find((option) => option.id === this.activeId);
		active?.click();
	}
}

const COMMAND_CONTEXT_KEY = Symbol('command');

export function setCommandContext(state: CommandState): CommandState {
	return setContext(COMMAND_CONTEXT_KEY, state);
}

export function useCommand(): CommandState {
	const state = getContext<CommandState | undefined>(COMMAND_CONTEXT_KEY);
	if (!state) throw new Error('Command parts must be used within <CommandRoot>.');
	return state;
}
