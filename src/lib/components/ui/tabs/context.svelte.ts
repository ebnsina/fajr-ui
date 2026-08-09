import { getContext, setContext } from 'svelte';
import { TrackedList } from '../internal/tracked-list.svelte';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'default' | 'underline';

type TabsInit = {
	value: () => string;
	setValue: (value: string) => void;
	orientation: () => TabsOrientation;
	baseId: string;
};

export class TabsState {
	#init: TabsInit;
	/** Registration order, so arrow keys can move to the next/previous tab. */
	#values = new TrackedList();

	constructor(init: TabsInit) {
		this.#init = init;
	}

	get value(): string {
		return this.#init.value();
	}

	get orientation(): TabsOrientation {
		return this.#init.orientation();
	}

	select(value: string): void {
		this.#init.setValue(value);
	}

	tabId(value: string): string {
		return `${this.#init.baseId}-tab-${value}`;
	}

	panelId(value: string): string {
		return `${this.#init.baseId}-panel-${value}`;
	}

	register(value: string): () => void {
		return this.#values.add(value);
	}

	/** Wraps around at both ends, which is what a tablist is expected to do. */
	move(from: string, delta: number): string | undefined {
		return this.#values.neighbour(from, delta);
	}

	first(): string | undefined {
		return this.#values.items[0];
	}

	last(): string | undefined {
		return this.#values.items[this.#values.items.length - 1];
	}
}

const TABS_CONTEXT_KEY = Symbol('tabs');

export function setTabsContext(state: TabsState): TabsState {
	return setContext(TABS_CONTEXT_KEY, state);
}

export function useTabs(): TabsState {
	const state = getContext<TabsState | undefined>(TABS_CONTEXT_KEY);
	if (!state) throw new Error('Tabs parts must be used within <Tabs>.');
	return state;
}
