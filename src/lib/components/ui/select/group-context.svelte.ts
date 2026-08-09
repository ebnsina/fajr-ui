import { getContext, hasContext, setContext } from 'svelte';

const SELECT_GROUP_KEY = Symbol('select-group');

/**
 * Carries the group's label id from SelectGroup down to SelectLabel.
 *
 * A `role="group"` inside a listbox has to be named, or a screen-reader user
 * arrowing the options hears one flat run and is never told which category they
 * are in — the very thing the visible heading tells everyone else.
 */
export function setSelectGroupLabelId(id: string): string {
	return setContext(SELECT_GROUP_KEY, id);
}

export function useSelectGroupLabelId(): string | undefined {
	return hasContext(SELECT_GROUP_KEY) ? getContext<string>(SELECT_GROUP_KEY) : undefined;
}
