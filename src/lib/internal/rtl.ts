/**
 * Whether an element is laid out right-to-left.
 *
 * Read from the computed style rather than from `document.dir`, so a component
 * inside a `dir="rtl"` subtree is correct even when the page is not — a common
 * arrangement when one panel of an interface is in Arabic or Hebrew.
 *
 * This matters for keyboard handling. WAI-ARIA's authoring practices are
 * explicit that in a right-to-left horizontal widget the arrow keys swap: Right
 * moves to the *previous* item and Left to the next, because the keys follow the
 * visual order rather than the document order. A tablist that keeps Right going
 * forwards feels backwards to anyone reading the row from the right.
 *
 * Vertical axes are unaffected — Up and Down mean the same thing in every
 * direction.
 */
export function isRTL(element: Element | null | undefined): boolean {
	if (!element) return false;
	return getComputedStyle(element).direction === 'rtl';
}

/**
 * `1` or `-1`, to multiply a horizontal step by. Reads as
 * `move(index + step * horizontalSign(el))` at the call site.
 */
export function horizontalSign(element: Element | null | undefined): 1 | -1 {
	return isRTL(element) ? -1 : 1;
}
