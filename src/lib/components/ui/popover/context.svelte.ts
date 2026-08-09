import { getContext, setContext } from 'svelte';

type PopoverInit = {
	open: () => boolean;
	setOpen: (open: boolean) => void;
	titleId: string;
	descriptionId: string;
};

export class PopoverState {
	#init: PopoverInit;
	/** Set by the trigger; the popup positions against it. */
	anchor = $state<HTMLElement | null>(null);
	titleRendered = $state(false);
	descriptionRendered = $state(false);

	constructor(init: PopoverInit) {
		this.#init = init;
	}

	get open(): boolean {
		return this.#init.open();
	}

	set open(next: boolean) {
		this.#init.setOpen(next);
	}

	get titleId(): string {
		return this.#init.titleId;
	}

	get descriptionId(): string {
		return this.#init.descriptionId;
	}

	toggle(): void {
		this.#init.setOpen(!this.#init.open());
	}

	close(): void {
		this.#init.setOpen(false);
	}
}

const POPOVER_CONTEXT_KEY = Symbol('popover');

export function setPopoverContext(state: PopoverState): PopoverState {
	return setContext(POPOVER_CONTEXT_KEY, state);
}

/**
 * Optional on purpose. PopoverPopup is also the positioning primitive behind
 * Menu, Select and Date Picker, which drive it by prop rather than through a
 * Popover root — so a missing context is a valid arrangement, not an error.
 */
export function usePopoverOptional(): PopoverState | undefined {
	return getContext<PopoverState | undefined>(POPOVER_CONTEXT_KEY);
}

export function usePopover(): PopoverState {
	const state = usePopoverOptional();
	if (!state) throw new Error('This Popover part must be used within <Popover>.');
	return state;
}
