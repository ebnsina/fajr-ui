import { getContext, setContext } from 'svelte';

type ComboboxInit = {
	value: () => string | undefined;
	setValue: (value: string | undefined) => void;
	query: () => string;
	setQuery: (query: string) => void;
	open: () => boolean;
	setOpen: (open: boolean) => void;
	/** Free-form fields keep whatever was typed; constrained ones do not. */
	freeform: () => boolean;
	filter: (label: string, query: string) => boolean;
	baseId: string;
};

export class ComboboxState {
	#init: ComboboxInit;
	activeId = $state<string | undefined>();
	list = $state<HTMLElement | null>(null);
	anchor = $state<HTMLElement | null>(null);
	/** Typing filters; a selection or a close shows the chosen label again. */
	typing = $state(false);
	/** Reported by the chosen item so the input can show its text. */
	selectedLabel = $state<string | undefined>();

	constructor(init: ComboboxInit) {
		this.#init = init;
	}

	get value(): string | undefined {
		return this.#init.value();
	}

	get query(): string {
		return this.#init.query();
	}

	get open(): boolean {
		return this.#init.open();
	}

	get freeform(): boolean {
		return this.#init.freeform();
	}

	get listId(): string {
		return `${this.#init.baseId}-list`;
	}

	/** What the field displays: the query while typing, the label otherwise. */
	get text(): string {
		if (this.typing) return this.query;
		return this.freeform ? this.query : (this.selectedLabel ?? '');
	}

	matches(label: string): boolean {
		return this.typing ? this.#init.filter(label, this.query) : true;
	}

	setQuery(query: string): void {
		this.typing = true;
		this.#init.setQuery(query);
		this.#init.setOpen(true);
	}

	setOpen(open: boolean): void {
		this.#init.setOpen(open);
		if (!open) this.typing = false;
	}

	select(value: string, label: string): void {
		this.#init.setValue(value);
		this.selectedLabel = label;
		if (this.freeform) this.#init.setQuery(label);
		this.typing = false;
		this.setOpen(false);
	}

	clear(): void {
		this.#init.setValue(undefined);
		this.#init.setQuery('');
		this.selectedLabel = undefined;
		this.typing = false;
	}

	#options(): HTMLElement[] {
		return this.list
			? [...this.list.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')]
			: [];
	}

	/** Keeps the active option valid as filtering changes what is rendered. */
	sync(): void {
		const options = this.#options();
		if (options.length === 0) {
			this.activeId = undefined;
			return;
		}
		if (!options.some((option) => option.id === this.activeId)) this.activeId = options[0].id;
	}

	move(delta: number): void {
		this.setOpen(true);
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

	choose(): void {
		this.#options()
			.find((option) => option.id === this.activeId)
			?.click();
	}
}

const COMBOBOX_CONTEXT_KEY = Symbol('combobox');

export function setComboboxContext(state: ComboboxState): ComboboxState {
	return setContext(COMBOBOX_CONTEXT_KEY, state);
}

export function useCombobox(): ComboboxState {
	const state = getContext<ComboboxState | undefined>(COMBOBOX_CONTEXT_KEY);
	if (!state) throw new Error('Combobox parts must be used within <ComboboxRoot>.');
	return state;
}
