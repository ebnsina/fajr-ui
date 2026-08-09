import { getContext, hasContext, setContext } from 'svelte';

type MenuSubInit = {
	open: () => boolean;
	setOpen: (open: boolean) => void;
	baseId: string;
};

/** Time the pointer may spend heading toward the submenu before it closes. */
const SAFE_PATH_GRACE = 300;
const OPEN_DELAY = 120;

export class MenuSubState {
	#init: MenuSubInit;
	/** The trigger the popup anchors to, and the popup itself. */
	anchor = $state<HTMLElement | null>(null);
	popup = $state<HTMLElement | null>(null);
	#openTimer: ReturnType<typeof setTimeout> | undefined;
	#closeTimer: ReturnType<typeof setTimeout> | undefined;
	/** Where the pointer was when it left the trigger, for the direction check. */
	#exit: { x: number; y: number } | null = null;

	constructor(init: MenuSubInit) {
		this.#init = init;
	}

	get open(): boolean {
		return this.#init.open();
	}

	get triggerId(): string {
		return `${this.#init.baseId}-trigger`;
	}

	get popupId(): string {
		return `${this.#init.baseId}-popup`;
	}

	/** Opening on a short delay stops a submenu firing as the pointer passes over. */
	scheduleOpen(): void {
		clearTimeout(this.#closeTimer);
		clearTimeout(this.#openTimer);
		this.#openTimer = setTimeout(() => this.#init.setOpen(true), OPEN_DELAY);
	}

	openNow(): void {
		clearTimeout(this.#openTimer);
		clearTimeout(this.#closeTimer);
		this.#init.setOpen(true);
	}

	close(): void {
		clearTimeout(this.#openTimer);
		clearTimeout(this.#closeTimer);
		this.#exit = null;
		this.#init.setOpen(false);
	}

	cancelClose(): void {
		clearTimeout(this.#closeTimer);
	}

	/**
	 * The safe path. Moving diagonally from the trigger toward the open submenu
	 * necessarily passes over sibling items, and closing on that would make the
	 * submenu impossible to reach. So a close is deferred while the pointer is
	 * still travelling in the submenu's direction, and only lands if it stops or
	 * turns back.
	 */
	scheduleClose(event: PointerEvent, popup: HTMLElement | null): void {
		clearTimeout(this.#openTimer);
		this.#exit = { x: event.clientX, y: event.clientY };

		if (!popup) {
			this.#closeTimer = setTimeout(() => this.#init.setOpen(false), SAFE_PATH_GRACE);
			return;
		}

		const box = popup.getBoundingClientRect();
		// Heading toward the panel horizontally, and vertically within its span
		// (allowing for the diagonal), counts as still on the path.
		const towards = box.left > this.#exit.x ? 1 : -1;
		const check = (move: PointerEvent) => {
			const heading = (move.clientX - this.#exit!.x) * towards > 0;
			const within = move.clientY > box.top - 24 && move.clientY < box.bottom + 24;
			if (heading && within) return;
			cleanup();
			this.#init.setOpen(false);
		};
		const cleanup = () => {
			document.removeEventListener('pointermove', check);
			clearTimeout(this.#closeTimer);
		};

		document.addEventListener('pointermove', check);
		this.#closeTimer = setTimeout(() => {
			cleanup();
			this.#init.setOpen(false);
		}, SAFE_PATH_GRACE);
	}
}

const MENU_SUB_CONTEXT_KEY = Symbol('menu-sub');

export function setMenuSubContext(state: MenuSubState): MenuSubState {
	return setContext(MENU_SUB_CONTEXT_KEY, state);
}

/** Optional — MenuItem needs to know whether it is inside a submenu. */
export function useMenuSub(): MenuSubState | undefined {
	return hasContext(MENU_SUB_CONTEXT_KEY)
		? getContext<MenuSubState>(MENU_SUB_CONTEXT_KEY)
		: undefined;
}

/** For the submenu's own parts, which cannot work without it. */
export function requireMenuSub(): MenuSubState {
	const state = useMenuSub();
	if (!state) throw new Error('Submenu parts must be used within <MenuSub>.');
	return state;
}
