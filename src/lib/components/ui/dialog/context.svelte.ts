import { getContext, setContext } from 'svelte';
import { TrackedList } from '../internal/tracked-list.svelte';

type DialogInit = {
	close: () => void;
	titleId: string;
	descriptionId: string;
};

export class DialogState {
	#init: DialogInit;
	#titles = new TrackedList();
	#descriptions = new TrackedList();

	constructor(init: DialogInit) {
		this.#init = init;
	}

	get titleId(): string {
		return this.#init.titleId;
	}

	get descriptionId(): string {
		return this.#init.descriptionId;
	}

	/**
	 * Only point `aria-labelledby` at the title once one is actually rendered —
	 * a dangling reference leaves the dialog with no accessible name at all,
	 * which is worse than falling back to the `title` prop.
	 */
	get labelledBy(): string | undefined {
		return this.#titles.length > 0 ? this.#init.titleId : undefined;
	}

	get describedBy(): string | undefined {
		return this.#descriptions.length > 0 ? this.#init.descriptionId : undefined;
	}

	registerTitle(id: string): () => void {
		return this.#titles.add(id);
	}

	registerDescription(id: string): () => void {
		return this.#descriptions.add(id);
	}

	close(): void {
		this.#init.close();
	}
}

const DIALOG_CONTEXT_KEY = Symbol('dialog');

export function setDialogContext(state: DialogState): DialogState {
	return setContext(DIALOG_CONTEXT_KEY, state);
}

export function useDialog(): DialogState {
	const state = getContext<DialogState | undefined>(DIALOG_CONTEXT_KEY);
	if (!state) throw new Error('Dialog parts must be used within <Dialog>.');
	return state;
}
