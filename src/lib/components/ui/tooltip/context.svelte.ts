import { getContext, setContext } from 'svelte';

/**
 * Shared timing across every tooltip on the page.
 *
 * After one closes, the next opens immediately and without animation. Moving
 * along a toolbar should feel like reading labels rather than waiting for each
 * one in turn. This lives at module scope for the same reason it does in the
 * action: the window is a property of the page, not of one tooltip.
 */
export const OPEN_DELAY = 600;
export const INSTANT_WINDOW = 400;

let lastClosedAt = 0;

export function markClosed(): void {
	lastClosedAt = Date.now();
}

export function isInstant(): boolean {
	return Date.now() - lastClosedAt < INSTANT_WINDOW;
}

type TooltipInit = {
	open: () => boolean;
	setOpen: (open: boolean) => void;
	contentId: () => string;
};

export class TooltipState {
	#init: TooltipInit;

	constructor(init: TooltipInit) {
		this.#init = init;
	}

	get open(): boolean {
		return this.#init.open();
	}

	get contentId(): string {
		return this.#init.contentId();
	}

	show(): void {
		this.#init.setOpen(true);
	}

	hide(): void {
		if (this.#init.open()) markClosed();
		this.#init.setOpen(false);
	}
}

const TOOLTIP_CONTEXT_KEY = Symbol('tooltip');

export function setTooltipContext(state: TooltipState): TooltipState {
	return setContext(TOOLTIP_CONTEXT_KEY, state);
}

export function useTooltip(): TooltipState {
	return getContext<TooltipState>(TOOLTIP_CONTEXT_KEY);
}
