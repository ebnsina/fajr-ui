import { getContext, setContext, untrack } from 'svelte';

type SelectInit = {
	value: () => string | undefined;
	setValue: (value: string) => void;
	close: () => void;
	listbox: () => HTMLElement | null;
	baseId: string;
};

const OPTION_SELECTOR = '[role="option"]';

export class SelectState {
	#init: SelectInit;
	/** value → label, so the trigger can show the chosen option's text. */
	#labels = $state<Record<string, string>>({});
	#typeahead = '';
	#typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

	constructor(init: SelectInit) {
		this.#init = init;
	}

	get value(): string | undefined {
		return this.#init.value();
	}

	get selectedLabel(): string | undefined {
		const value = this.value;
		return value === undefined ? undefined : this.#labels[value];
	}

	optionId(value: string): string {
		return `${this.#init.baseId}-option-${value}`;
	}

	/**
	 * Options report their text so the trigger can render it. Untracked for the
	 * same reason as elsewhere: callers register from an `$effect`, and reading
	 * the map in order to write it would make that effect depend on its own output.
	 */
	register(value: string, label: string): () => void {
		untrack(() => {
			this.#labels = { ...this.#labels, [value]: label };
		});
		return () =>
			untrack(() => {
				const rest = { ...this.#labels };
				delete rest[value];
				this.#labels = rest;
			});
	}

	select(value: string): void {
		this.#init.setValue(value);
		this.#init.close();
	}

	close(): void {
		this.#init.close();
	}

	/** Options in document order, minus the disabled ones. */
	#options(): HTMLElement[] {
		const listbox = this.#init.listbox();
		if (!listbox) return [];
		return [...listbox.querySelectorAll<HTMLElement>(OPTION_SELECTOR)].filter(
			(option) => option.getAttribute('aria-disabled') !== 'true'
		);
	}

	/** Opens onto the current selection rather than the top of the list. */
	focusSelected(): void {
		const options = this.#options();
		const current = options.find((option) => option.dataset.value === this.value);
		(current ?? options[0])?.focus();
	}

	focusFirst(): void {
		this.#options()[0]?.focus();
	}

	focusLast(): void {
		const options = this.#options();
		options[options.length - 1]?.focus();
	}

	move(delta: number): void {
		const options = this.#options();
		if (options.length === 0) return;
		const index = options.indexOf(document.activeElement as HTMLElement);
		const next = index === -1 ? 0 : (index + delta + options.length) % options.length;
		options[next]?.focus();
	}

	typeahead(key: string): boolean {
		if (key.length !== 1 || !/\S/.test(key)) return false;

		clearTimeout(this.#typeaheadTimer);
		this.#typeahead += key.toLowerCase();
		this.#typeaheadTimer = setTimeout(() => (this.#typeahead = ''), 500);

		const options = this.#options();
		const current = options.indexOf(document.activeElement as HTMLElement);
		const ordered = [...options.slice(current + 1), ...options.slice(0, current + 1)];
		const match = ordered.find((option) =>
			(option.textContent ?? '').trim().toLowerCase().startsWith(this.#typeahead)
		);

		match?.focus();
		return Boolean(match);
	}
}

const SELECT_CONTEXT_KEY = Symbol('select');

export function setSelectContext(state: SelectState): SelectState {
	return setContext(SELECT_CONTEXT_KEY, state);
}

export function useSelect(): SelectState {
	const state = getContext<SelectState | undefined>(SELECT_CONTEXT_KEY);
	if (!state) throw new Error('Select parts must be used within <Select>.');
	return state;
}
