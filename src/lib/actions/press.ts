import type { Action } from 'svelte/action';

export type PressOptions = {
	disabled?: boolean;
};

/**
 * Sets `data-pressed` for as long as the element is genuinely held down.
 *
 * `:active` is not enough on its own: it drops the moment the pointer leaves the
 * element, even though releasing outside still counts as a press to the user,
 * and it does not fire at all for Space or Enter. This keeps the pressed state
 * on until the press actually ends, which is what the styling assumes.
 */
export const press: Action<HTMLElement, PressOptions | undefined> = (node, options) => {
	let current = options ?? {};
	let pointerId: number | null = null;
	let keyed = false;

	const set = () => node.setAttribute('data-pressed', '');
	const clear = () => node.removeAttribute('data-pressed');

	function onpointerdown(event: PointerEvent) {
		if (current.disabled || event.button !== 0) return;
		pointerId = event.pointerId;
		// Capture so the release is still ours even if the pointer wanders off.
		node.setPointerCapture(event.pointerId);
		set();
	}

	function endPointer(event: PointerEvent) {
		if (pointerId === null || event.pointerId !== pointerId) return;
		pointerId = null;
		if (!keyed) clear();
	}

	function onkeydown(event: KeyboardEvent) {
		if (current.disabled || event.repeat) return;
		// The two keys that activate a button.
		if (event.key !== ' ' && event.key !== 'Enter') return;
		keyed = true;
		set();
	}

	function onkeyup(event: KeyboardEvent) {
		if (event.key !== ' ' && event.key !== 'Enter') return;
		keyed = false;
		if (pointerId === null) clear();
	}

	// Losing focus mid-press means the press can never complete here.
	function onblur() {
		keyed = false;
		pointerId = null;
		clear();
	}

	node.addEventListener('pointerdown', onpointerdown);
	node.addEventListener('pointerup', endPointer);
	node.addEventListener('pointercancel', endPointer);
	node.addEventListener('keydown', onkeydown);
	node.addEventListener('keyup', onkeyup);
	node.addEventListener('blur', onblur);

	return {
		update(next: PressOptions | undefined) {
			current = next ?? {};
			if (current.disabled) onblur();
		},
		destroy() {
			node.removeEventListener('pointerdown', onpointerdown);
			node.removeEventListener('pointerup', endPointer);
			node.removeEventListener('pointercancel', endPointer);
			node.removeEventListener('keydown', onkeydown);
			node.removeEventListener('keyup', onkeyup);
			node.removeEventListener('blur', onblur);
		}
	};
};
