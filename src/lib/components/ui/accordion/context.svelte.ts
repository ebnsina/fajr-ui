import { getContext, setContext } from 'svelte';

export type AccordionType = 'single' | 'multiple';

type AccordionInit = {
	type: () => AccordionType;
	value: () => string | string[] | undefined;
	setValue: (value: string | string[] | undefined) => void;
	collapsible: () => boolean;
	disabled: () => boolean;
	root: () => HTMLElement | null;
	baseId: string;
};

const TRIGGER_SELECTOR = '[data-slot="accordion-trigger"]:not([disabled])';

export class AccordionState {
	#init: AccordionInit;

	constructor(init: AccordionInit) {
		this.#init = init;
	}

	get disabled(): boolean {
		return this.#init.disabled();
	}

	triggerId(value: string): string {
		return `${this.#init.baseId}-${value}-trigger`;
	}

	contentId(value: string): string {
		return `${this.#init.baseId}-${value}-content`;
	}

	isOpen(value: string): boolean {
		const current = this.#init.value();
		return Array.isArray(current) ? current.includes(value) : current === value;
	}

	toggle(value: string): void {
		const current = this.#init.value();

		if (this.#init.type() === 'multiple') {
			const list = Array.isArray(current) ? current : current ? [current] : [];
			this.#init.setValue(
				list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]
			);
			return;
		}

		// In single mode, `collapsible` decides whether the open panel can be
		// closed by clicking its own header, or whether one must always stay open.
		if (current === value) {
			if (this.#init.collapsible()) this.#init.setValue(undefined);
			return;
		}
		this.#init.setValue(value);
	}

	#triggers(): HTMLElement[] {
		const root = this.#init.root();
		return root ? [...root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)] : [];
	}

	/** Arrow keys move between headers and wrap; Home and End jump to the ends. */
	move(from: HTMLElement, delta: number | 'first' | 'last'): void {
		const triggers = this.#triggers();
		if (triggers.length === 0) return;

		if (delta === 'first') {
			triggers[0].focus();
			return;
		}
		if (delta === 'last') {
			triggers[triggers.length - 1].focus();
			return;
		}

		const index = triggers.indexOf(from);
		if (index === -1) return;
		triggers[(index + delta + triggers.length) % triggers.length].focus();
	}
}

const ACCORDION_CONTEXT_KEY = Symbol('accordion');
const ACCORDION_ITEM_KEY = Symbol('accordion-item');

export function setAccordionContext(state: AccordionState): AccordionState {
	return setContext(ACCORDION_CONTEXT_KEY, state);
}

export function useAccordion(): AccordionState {
	const state = getContext<AccordionState | undefined>(ACCORDION_CONTEXT_KEY);
	if (!state) throw new Error('Accordion parts must be used within <Accordion>.');
	return state;
}

export type AccordionItemContext = {
	value: string;
	disabled: () => boolean;
};

export function setAccordionItemContext(item: AccordionItemContext): AccordionItemContext {
	return setContext(ACCORDION_ITEM_KEY, item);
}

export function useAccordionItem(): AccordionItemContext {
	const item = getContext<AccordionItemContext | undefined>(ACCORDION_ITEM_KEY);
	if (!item) throw new Error('Accordion parts must be used within <AccordionItem>.');
	return item;
}
