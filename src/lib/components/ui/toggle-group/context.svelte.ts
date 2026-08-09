import { getContext, hasContext, setContext } from 'svelte';
import type { ToggleSize, ToggleVariant } from '../toggle.svelte';

type ToggleGroupInit = {
	type: () => 'single' | 'multiple';
	value: () => string | string[] | undefined;
	setValue: (value: string | string[] | undefined) => void;
	variant: () => ToggleVariant | undefined;
	size: () => ToggleSize | undefined;
};

export class ToggleGroupState {
	#init: ToggleGroupInit;

	constructor(init: ToggleGroupInit) {
		this.#init = init;
	}

	get variant(): ToggleVariant | undefined {
		return this.#init.variant();
	}

	get size(): ToggleSize | undefined {
		return this.#init.size();
	}

	isPressed(value: string): boolean {
		const current = this.#init.value();
		return Array.isArray(current) ? current.includes(value) : current === value;
	}

	toggle(value: string): void {
		const current = this.#init.value();

		if (this.#init.type() === 'multiple') {
			const list = Array.isArray(current) ? current : current ? [current] : [];
			this.#init.setValue(
				list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]
			);
			return;
		}

		this.#init.setValue(current === value ? undefined : value);
	}
}

const TOGGLE_GROUP_CONTEXT_KEY = Symbol('toggle-group');

export function setToggleGroupContext(state: ToggleGroupState): ToggleGroupState {
	return setContext(TOGGLE_GROUP_CONTEXT_KEY, state);
}

/** Optional — Toggle works standalone too. */
export function useToggleGroup(): ToggleGroupState | undefined {
	return hasContext(TOGGLE_GROUP_CONTEXT_KEY)
		? getContext<ToggleGroupState>(TOGGLE_GROUP_CONTEXT_KEY)
		: undefined;
}
