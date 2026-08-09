import { getContext, setContext } from 'svelte';

type CollapsibleInit = {
	open: () => boolean;
	toggle: () => void;
	disabled: () => boolean;
	baseId: string;
};

export class CollapsibleState {
	#init: CollapsibleInit;

	constructor(init: CollapsibleInit) {
		this.#init = init;
	}

	get open(): boolean {
		return this.#init.open();
	}

	get disabled(): boolean {
		return this.#init.disabled();
	}

	get triggerId(): string {
		return `${this.#init.baseId}-trigger`;
	}

	get contentId(): string {
		return `${this.#init.baseId}-content`;
	}

	toggle(): void {
		if (this.disabled) return;
		this.#init.toggle();
	}
}

const COLLAPSIBLE_CONTEXT_KEY = Symbol('collapsible');

export function setCollapsibleContext(state: CollapsibleState): CollapsibleState {
	return setContext(COLLAPSIBLE_CONTEXT_KEY, state);
}

export function useCollapsible(): CollapsibleState {
	const state = getContext<CollapsibleState | undefined>(COLLAPSIBLE_CONTEXT_KEY);
	if (!state) throw new Error('Collapsible parts must be used within <Collapsible>.');
	return state;
}
