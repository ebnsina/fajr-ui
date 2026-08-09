import { getContext, hasContext, setContext } from 'svelte';

export type FormErrors = Record<string, string | undefined>;

type FormInit = {
	errors: () => FormErrors;
	submitting: () => boolean;
};

export class FormState {
	#init: FormInit;

	constructor(init: FormInit) {
		this.#init = init;
	}

	get errors(): FormErrors {
		return this.#init.errors();
	}

	get submitting(): boolean {
		return this.#init.submitting();
	}

	errorFor(name: string): string | undefined {
		return this.#init.errors()[name];
	}
}

const FORM_CONTEXT_KEY = Symbol('form');

export function setFormContext(state: FormState): FormState {
	return setContext(FORM_CONTEXT_KEY, state);
}

/** Optional — FormField works outside a Form, just without shared errors. */
export function useForm(): FormState | undefined {
	return hasContext(FORM_CONTEXT_KEY) ? getContext<FormState>(FORM_CONTEXT_KEY) : undefined;
}
