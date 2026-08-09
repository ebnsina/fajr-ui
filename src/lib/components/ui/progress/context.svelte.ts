import { getContext, setContext } from 'svelte';

type ProgressInit = {
	value: () => number | null;
	max: () => number;
	labelId: string;
};

export class ProgressState {
	#init: ProgressInit;

	constructor(init: ProgressInit) {
		this.#init = init;
	}

	get value(): number | null {
		return this.#init.value();
	}

	get max(): number {
		return this.#init.max();
	}

	get labelId(): string {
		return this.#init.labelId;
	}

	get indeterminate(): boolean {
		return this.#init.value() === null;
	}

	get percent(): number {
		if (this.indeterminate) return 0;
		return Math.min(100, Math.max(0, ((this.#init.value() ?? 0) / this.#init.max()) * 100));
	}
}

const PROGRESS_CONTEXT_KEY = Symbol('progress');

export function setProgressContext(state: ProgressState): ProgressState {
	return setContext(PROGRESS_CONTEXT_KEY, state);
}

export function useProgress(): ProgressState {
	const state = getContext<ProgressState | undefined>(PROGRESS_CONTEXT_KEY);
	if (!state) throw new Error('Progress parts must be used within <ProgressRoot>.');
	return state;
}
