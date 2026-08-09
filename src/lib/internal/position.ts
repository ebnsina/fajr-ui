export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export type PositionOptions = {
	side?: Side;
	align?: Align;
	/** Distance between the anchor and the floating element, in pixels. */
	offset?: number;
	/** Minimum gap kept between the floating element and the viewport edge. */
	padding?: number;
};

export type Placement = {
	left: number;
	top: number;
	side: Side;
	/**
	 * Where the floating element should scale from. A popover that grows out of
	 * its own trigger reads as caused by the click; one that grows from its
	 * centre reads as unrelated to it.
	 */
	transformOrigin: string;
};

const OPPOSITE: Record<Side, Side> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
};

const ORIGIN: Record<Side, string> = {
	top: 'bottom center',
	bottom: 'top center',
	left: 'right center',
	right: 'left center'
};

/**
 * Places `floating` next to `anchor`, flipping to the opposite side when the
 * preferred one cannot fit and clamping so it never leaves the viewport.
 */
export function place(
	anchor: DOMRect,
	floating: DOMRect,
	options: PositionOptions = {}
): Placement {
	const { side = 'top', align = 'center', offset = 6, padding = 8 } = options;

	const room = {
		top: anchor.top,
		bottom: window.innerHeight - anchor.bottom,
		left: anchor.left,
		right: window.innerWidth - anchor.right
	};

	const vertical = side === 'top' || side === 'bottom';
	const needed = (vertical ? floating.height : floating.width) + offset;
	// Only flip when the preferred side genuinely cannot fit and the other can.
	const resolved: Side =
		room[side] < needed && room[OPPOSITE[side]] >= needed ? OPPOSITE[side] : side;

	let left: number;
	let top: number;

	if (resolved === 'top' || resolved === 'bottom') {
		top = resolved === 'top' ? anchor.top - floating.height - offset : anchor.bottom + offset;
		left =
			align === 'start'
				? anchor.left
				: align === 'end'
					? anchor.right - floating.width
					: anchor.left + anchor.width / 2 - floating.width / 2;
	} else {
		left = resolved === 'left' ? anchor.left - floating.width - offset : anchor.right + offset;
		top =
			align === 'start'
				? anchor.top
				: align === 'end'
					? anchor.bottom - floating.height
					: anchor.top + anchor.height / 2 - floating.height / 2;
	}

	left = Math.max(padding, Math.min(left, window.innerWidth - floating.width - padding));
	top = Math.max(padding, Math.min(top, window.innerHeight - floating.height - padding));

	return { left, top, side: resolved, transformOrigin: ORIGIN[resolved] };
}

/**
 * Re-runs `onChange` whenever the anchor could have moved: scrolling any
 * ancestor, a viewport resize, or the element itself changing size.
 */
export function trackAnchor(anchor: HTMLElement, onChange: () => void): () => void {
	// `capture` so scrolling in any ancestor container counts, not just the page.
	window.addEventListener('scroll', onChange, true);
	window.addEventListener('resize', onChange);

	const observer = new ResizeObserver(onChange);
	observer.observe(anchor);

	return () => {
		window.removeEventListener('scroll', onChange, true);
		window.removeEventListener('resize', onChange);
		observer.disconnect();
	};
}
