import { getContext, setContext } from 'svelte';

export type FieldsetContext = {
	legendId: string;
	descriptionId: string;
	/**
	 * Set by FieldsetDescription when it renders. The fieldset only points at the
	 * description when one exists, so an empty group is not given a dangling
	 * `aria-describedby`.
	 */
	hasDescription: () => boolean;
	registerDescription: () => void;
};

const FIELDSET_CONTEXT_KEY = Symbol('fieldset');

export function setFieldsetContext(context: FieldsetContext): FieldsetContext {
	return setContext(FIELDSET_CONTEXT_KEY, context);
}

export function useFieldset(): FieldsetContext | undefined {
	return getContext<FieldsetContext | undefined>(FIELDSET_CONTEXT_KEY);
}
