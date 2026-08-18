/**
 * Holds the document still while a modal is open.
 *
 * `showModal()` gives a focus trap, Escape handling and an inert background,
 * which is most of what a modal needs — but not this. The page behind keeps its
 * scroll live, so a wheel gesture over the backdrop scrolls the document under
 * the dialog.
 *
 * Modals stack — a sheet can open a dialog — so this cannot be a boolean. The
 * obvious alternative is a depth counter, and that was the first version: it
 * leaked. One unbalanced release and the page is left permanently unscrollable,
 * with `overflow: hidden` stuck on `<html>` and no open dialog to explain it.
 * Worse, the next lock then captures `hidden` as the value to restore, so the
 * bug cements itself.
 *
 * So the state is the set of elements currently asking for the lock, not a
 * count. Registering twice is idempotent, releasing twice is idempotent, and
 * `isConnected` prunes anything that was removed from the document without
 * releasing — which is the leak the counter had no way to detect.
 */
const owners = new Set<Element>();

let overflow = '';
let padding = '';
let locked = false;

function apply() {
	if (typeof document === 'undefined') return;

	// Anything that has left the document cannot still need the page held.
	for (const owner of owners) if (!owner.isConnected) owners.delete(owner);

	const root = document.documentElement;
	const wanted = owners.size > 0;
	if (wanted === locked) return;

	if (wanted) {
		overflow = root.style.overflow;
		padding = root.style.paddingInlineEnd;

		/*
		 * Hiding the overflow reclaims the scrollbar's width and the page jumps
		 * sideways to fill it. Measuring the gap first and padding by exactly that
		 * much holds the layout still. It is zero on overlay-scrollbar platforms,
		 * where the padding is skipped rather than written as `0px`.
		 */
		const gap = window.innerWidth - root.clientWidth;
		root.style.overflow = 'hidden';
		if (gap > 0) root.style.paddingInlineEnd = `${gap}px`;
	} else {
		root.style.overflow = overflow;
		root.style.paddingInlineEnd = padding;
	}

	locked = wanted;
}

/**
 * Declares whether `owner` currently needs the page held still.
 *
 * Call it with the element itself rather than a token, so a modal that is torn
 * down mid-open can be recognised as gone on the next call.
 */
export function setScrollLock(owner: Element | null | undefined, wanted: boolean): void {
	if (!owner) return;
	if (wanted) owners.add(owner);
	else owners.delete(owner);
	apply();
}
