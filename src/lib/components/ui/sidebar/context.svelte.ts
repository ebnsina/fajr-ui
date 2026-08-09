import { getContext, setContext } from 'svelte';

export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarStateInit = {
	/** Reactive getter for the desktop open state. */
	open: () => boolean;
	setOpen: (open: boolean) => void;
	isMobile: () => boolean;
};

export class SidebarState {
	#init: SidebarStateInit;
	openMobile = $state(false);

	constructor(init: SidebarStateInit) {
		this.#init = init;
	}

	get open(): boolean {
		return this.#init.open();
	}

	get isMobile(): boolean {
		return this.#init.isMobile();
	}

	/** Drives `data-state`, which most of the sidebar's Tailwind classes key off. */
	get state(): 'expanded' | 'collapsed' {
		return this.open ? 'expanded' : 'collapsed';
	}

	setOpen(open: boolean): void {
		this.#init.setOpen(open);
	}

	setOpenMobile(open: boolean): void {
		this.openMobile = open;
	}

	toggle(): void {
		if (this.isMobile) this.openMobile = !this.openMobile;
		else this.setOpen(!this.open);
	}
}

/**
 * One group's share of the sidebar: the id its label will carry, and whether a
 * label was actually rendered.
 *
 * A `role="group"` with no accessible name announces as an unlabelled group,
 * which is worse than no grouping at all — the user is told there is a boundary
 * and not what it divides. But the label is optional, so the group cannot point
 * `aria-labelledby` at an id that may never exist. The label registers itself
 * and the group reads the flag.
 */
export class SidebarGroupState {
	readonly labelId: string;
	#labelled = $state(false);

	constructor(labelId: string) {
		this.labelId = labelId;
	}

	get labelled(): boolean {
		return this.#labelled;
	}

	/** Called from the label's `$effect`, so it returns its own undo. */
	register(): () => void {
		this.#labelled = true;
		return () => {
			this.#labelled = false;
		};
	}
}

const SIDEBAR_GROUP_CONTEXT_KEY = Symbol('sidebar-group');

export function setSidebarGroupContext(state: SidebarGroupState): SidebarGroupState {
	return setContext(SIDEBAR_GROUP_CONTEXT_KEY, state);
}

/** Optional — a group label outside a `<SidebarGroup>` is just a heading. */
export function useSidebarGroup(): SidebarGroupState | undefined {
	return getContext<SidebarGroupState | undefined>(SIDEBAR_GROUP_CONTEXT_KEY);
}

const SIDEBAR_CONTEXT_KEY = Symbol('sidebar');

export function setSidebarContext(state: SidebarState): SidebarState {
	return setContext(SIDEBAR_CONTEXT_KEY, state);
}

export function useSidebar(): SidebarState {
	const state = getContext<SidebarState | undefined>(SIDEBAR_CONTEXT_KEY);
	if (!state) throw new Error('useSidebar must be used within a <SidebarProvider>.');
	return state;
}
