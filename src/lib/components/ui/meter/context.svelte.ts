import { getContext, setContext } from 'svelte';

type MeterInit = {
	value: () => number;
	min: () => number;
	max: () => number;
	labelId: string;
};

export class MeterState {
	#init: MeterInit;

	constructor(init: MeterInit) {
		this.#init = init;
	}

	get min(): number {
		return this.#init.min();
	}

	get max(): number {
		return this.#init.max();
	}

	get labelId(): string {
		return this.#init.labelId;
	}

	/** The reported value, held inside the declared range. */
	get value(): number {
		return Math.min(this.max, Math.max(this.min, this.#init.value()));
	}

	get percent(): number {
		const span = this.max - this.min;
		return span === 0 ? 0 : ((this.value - this.min) / span) * 100;
	}
}

const METER_CONTEXT_KEY = Symbol('meter');

export function setMeterContext(state: MeterState): MeterState {
	return setContext(METER_CONTEXT_KEY, state);
}

export function useMeter(): MeterState {
	const state = getContext<MeterState | undefined>(METER_CONTEXT_KEY);
	if (!state) throw new Error('Meter parts must be used within <MeterRoot>.');
	return state;
}
