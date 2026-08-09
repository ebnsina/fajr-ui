import { getContext, setContext } from 'svelte';

type RadioGroupInit = {
	name: () => string;
	value: () => string | undefined;
	setValue: (value: string) => void;
	disabled: () => boolean;
};

export class RadioGroupState {
	#init: RadioGroupInit;

	constructor(init: RadioGroupInit) {
		this.#init = init;
	}

	get name(): string {
		return this.#init.name();
	}

	get value(): string | undefined {
		return this.#init.value();
	}

	get disabled(): boolean {
		return this.#init.disabled();
	}

	isSelected(value: string): boolean {
		return this.value === value;
	}

	select(value: string): void {
		if (this.disabled) return;
		this.#init.setValue(value);
	}
}

const RADIO_GROUP_CONTEXT_KEY = Symbol('radio-group');

export function setRadioGroupContext(state: RadioGroupState): RadioGroupState {
	return setContext(RADIO_GROUP_CONTEXT_KEY, state);
}

export function useRadioGroup(): RadioGroupState {
	const state = getContext<RadioGroupState | undefined>(RADIO_GROUP_CONTEXT_KEY);
	if (!state) throw new Error('RadioGroupItem must be used within <RadioGroup>.');
	return state;
}
