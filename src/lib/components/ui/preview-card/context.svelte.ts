import { getContext, setContext } from 'svelte';

type PreviewCardInit = {
	openDelay: () => number;
	closeDelay: () => number;
};

export class PreviewCardState {
	#init: PreviewCardInit;
	#openTimer: ReturnType<typeof setTimeout> | undefined;
	#closeTimer: ReturnType<typeof setTimeout> | undefined;

	open = $state(false);
	anchor = $state<HTMLElement | null>(null);

	constructor(init: PreviewCardInit) {
		this.#init = init;
	}

	scheduleOpen(): void {
		clearTimeout(this.#closeTimer);
		this.#openTimer = setTimeout(() => (this.open = true), this.#init.openDelay());
	}

	/**
	 * Closing is delayed so the pointer can cross the gap between the trigger and
	 * the card. Without it the card vanishes the moment you move toward it.
	 */
	scheduleClose(): void {
		clearTimeout(this.#openTimer);
		this.#closeTimer = setTimeout(() => (this.open = false), this.#init.closeDelay());
	}

	/** Called when the pointer lands on the card itself. */
	hold(): void {
		clearTimeout(this.#closeTimer);
	}

	openNow(): void {
		clearTimeout(this.#closeTimer);
		this.open = true;
	}
}

const PREVIEW_CARD_CONTEXT_KEY = Symbol('preview-card');

export function setPreviewCardContext(state: PreviewCardState): PreviewCardState {
	return setContext(PREVIEW_CARD_CONTEXT_KEY, state);
}

export function usePreviewCard(): PreviewCardState {
	const state = getContext<PreviewCardState | undefined>(PREVIEW_CARD_CONTEXT_KEY);
	if (!state) throw new Error('Preview card parts must be used within <PreviewCardRoot>.');
	return state;
}
