import { getContext, setContext } from 'svelte';

/** A numbered page, or a collapsed run of them. */
export type PaginationSlot = number | 'gap';

type PaginationInit = {
	page: () => number;
	setPage: (page: number) => void;
	count: () => number;
	siblings: () => number;
	href: () => ((page: number) => string) | undefined;
};

/**
 * Shared state for the composable parts.
 *
 * The window calculation lives here rather than in the markup, which is what
 * makes splitting this component up worth doing at all: laying the control out
 * yourself should not mean rewriting the ellipsis logic. `slots` hands you the
 * finished sequence; the parts only decide how it looks.
 */
export class PaginationState {
	#init: PaginationInit;

	constructor(init: PaginationInit) {
		this.#init = init;
	}

	get page(): number {
		return this.#init.page();
	}

	get count(): number {
		return Math.max(1, this.#init.count());
	}

	get href(): ((page: number) => string) | undefined {
		return this.#init.href();
	}

	get isFirst(): boolean {
		return this.page <= 1;
	}

	get isLast(): boolean {
		return this.page >= this.count;
	}

	/**
	 * Page numbers with gaps collapsed to an ellipsis, always the same length.
	 *
	 * The obvious version simply drops a gap near either end, which makes the
	 * control four items wide on page 1 and seven in the middle — so it changes
	 * width as you page and shoves whatever sits beside it around. When a gap
	 * goes, the run of numbers grows to replace it.
	 */
	get slots(): PaginationSlot[] {
		const total = this.count;
		const siblings = this.#init.siblings();
		const width = siblings * 2 + 5;
		if (total <= width) return Array.from({ length: total }, (_, index) => index + 1);

		const range = (from: number, to: number) =>
			Array.from({ length: to - from + 1 }, (_, index) => from + index);

		const page = this.page;
		if (page <= siblings * 2 + 2) return [...range(1, width - 2), 'gap', total];
		if (page >= total - (siblings * 2 + 1)) return [1, 'gap', ...range(total - (width - 3), total)];
		return [1, 'gap', ...range(page - siblings, page + siblings), 'gap', total];
	}

	isCurrent(page: number): boolean {
		return page === this.page;
	}

	go(page: number): void {
		this.#init.setPage(Math.min(Math.max(1, page), this.count));
	}
}

const PAGINATION_CONTEXT_KEY = Symbol('pagination');

export function setPaginationContext(state: PaginationState): PaginationState {
	return setContext(PAGINATION_CONTEXT_KEY, state);
}

export function usePagination(): PaginationState {
	return getContext<PaginationState>(PAGINATION_CONTEXT_KEY);
}
