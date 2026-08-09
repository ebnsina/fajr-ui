import { getContext, setContext } from 'svelte';
import { TrackedList } from '../internal/tracked-list.svelte';

export type SheetSide = 'right' | 'left' | 'top' | 'bottom';
export type SheetVariant = 'default' | 'inset';

type SheetInit = {
	open: () => boolean;
	setOpen: (open: boolean) => void;
	side: () => SheetSide;
	variant: () => SheetVariant;
	titleId: string;
	descriptionId: string;
};

export class SheetState {
	#init: SheetInit;
	#titles = new TrackedList();
	#descriptions = new TrackedList();

	constructor(init: SheetInit) {
		this.#init = init;
	}

	get open(): boolean {
		return this.#init.open();
	}

	get side(): SheetSide {
		return this.#init.side();
	}

	get variant(): SheetVariant {
		return this.#init.variant();
	}

	get titleId(): string {
		return this.#init.titleId;
	}

	get descriptionId(): string {
		return this.#init.descriptionId;
	}

	/**
	 * Only point `aria-labelledby` at the title once one is rendered — a dangling
	 * reference leaves the sheet with no accessible name at all, which is worse
	 * than falling back to the `title` prop.
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

	toggle(): void {
		this.#init.setOpen(!this.#init.open());
	}

	close(): void {
		this.#init.setOpen(false);
	}
}

const SHEET_CONTEXT_KEY = Symbol('sheet');

export function setSheetContext(state: SheetState): SheetState {
	return setContext(SHEET_CONTEXT_KEY, state);
}

export function useSheet(): SheetState {
	const state = getContext<SheetState | undefined>(SHEET_CONTEXT_KEY);
	if (!state) throw new Error('Sheet parts must be used within <Sheet>.');
	return state;
}
