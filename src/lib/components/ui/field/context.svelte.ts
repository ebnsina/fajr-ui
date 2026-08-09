import { getContext, hasContext, setContext } from 'svelte';
import { TrackedList } from '../internal/tracked-list.svelte';

type FieldInit = {
	controlId: () => string;
	invalid: () => boolean;
	disabled: () => boolean;
};

/**
 * Shared wiring for a labelled control. Descriptions and errors register
 * themselves here so the control can point `aria-describedby` at whichever of
 * them are actually rendered — no ids threaded through props by hand.
 */
export class FieldState {
	#init: FieldInit;
	#describedBy = new TrackedList();

	constructor(init: FieldInit) {
		this.#init = init;
	}

	get controlId(): string {
		return this.#init.controlId();
	}

	get invalid(): boolean {
		return this.#init.invalid();
	}

	get disabled(): boolean {
		return this.#init.disabled();
	}

	/** `undefined` rather than an empty string, so the attribute is omitted. */
	get describedBy(): string | undefined {
		return this.#describedBy.joined;
	}

	register(id: string): () => void {
		return this.#describedBy.add(id);
	}
}

const FIELD_CONTEXT_KEY = Symbol('field');

export function setFieldContext(state: FieldState): FieldState {
	return setContext(FIELD_CONTEXT_KEY, state);
}

/** Optional — controls work standalone as well as inside a `<Field>`. */
export function useField(): FieldState | undefined {
	return hasContext(FIELD_CONTEXT_KEY) ? getContext<FieldState>(FIELD_CONTEXT_KEY) : undefined;
}
