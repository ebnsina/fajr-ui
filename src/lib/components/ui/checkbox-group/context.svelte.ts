import { getContext, setContext } from 'svelte';

type CheckboxGroupInit = {
	value: () => string[];
	setValue: (value: string[]) => void;
	/** Every selectable value, needed for the select-all parent. */
	allValues: () => string[];
	disabled: () => boolean;
	name: () => string | undefined;
};

export class CheckboxGroupState {
	#init: CheckboxGroupInit;

	constructor(init: CheckboxGroupInit) {
		this.#init = init;
	}

	get value(): string[] {
		return this.#init.value();
	}

	get disabled(): boolean {
		return this.#init.disabled();
	}

	get name(): string | undefined {
		return this.#init.name();
	}

	has(value: string): boolean {
		return this.value.includes(value);
	}

	set(value: string, checked: boolean): void {
		if (this.disabled) return;
		const current = this.value;
		this.#init.setValue(checked ? [...current, value] : current.filter((entry) => entry !== value));
	}

	/** True only when every value is selected. */
	get allChecked(): boolean {
		const all = this.#init.allValues();
		return all.length > 0 && all.every((entry) => this.has(entry));
	}

	/** Some but not all — the state a lone checkbox cannot express. */
	get someChecked(): boolean {
		return this.value.length > 0 && !this.allChecked;
	}

	/**
	 * Selecting all when partially selected, rather than clearing, matches what
	 * a half-filled box implies: the next click completes the set.
	 */
	toggleAll(): void {
		if (this.disabled) return;
		this.#init.setValue(this.allChecked ? [] : [...this.#init.allValues()]);
	}
}

const CHECKBOX_GROUP_CONTEXT_KEY = Symbol('checkbox-group');

export function setCheckboxGroupContext(state: CheckboxGroupState): CheckboxGroupState {
	return setContext(CHECKBOX_GROUP_CONTEXT_KEY, state);
}

export function useCheckboxGroup(): CheckboxGroupState {
	const state = getContext<CheckboxGroupState | undefined>(CHECKBOX_GROUP_CONTEXT_KEY);
	if (!state) throw new Error('Checkbox group parts must be used within <CheckboxGroup>.');
	return state;
}
