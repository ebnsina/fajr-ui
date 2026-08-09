import { browser } from '$app/environment';

export type Accent = 'black' | 'orange' | 'blue';

/**
 * Three accents: Black, Orange, Blue.
 *
 * A longer list was tried — burgundy, medium violet red, rose, dark olive green
 * — and each one needed its own contrast argument to justify keeping it. Two
 * that work everywhere without a footnote are worth more than six that do not.
 *
 * Named for what they are rather than for where they came from — the list is
 * short enough that the colour is the whole name.
 *
 * The swatch is the value the accent actually uses in light mode, so what you
 * pick is what you get.
 */
export const ACCENTS: { value: Accent; label: string; swatch: string }[] = [
	{ value: 'black', label: 'Black', swatch: '#262626' },
	{ value: 'orange', label: 'Orange', swatch: '#d63200' },
	{ value: 'blue', label: 'Blue', swatch: '#00679b' }
];

/**
 * Black, because the library should arrive without an opinion about your brand.
 * Pick a colour deliberately rather than inherit ours.
 */
export const DEFAULT_ACCENT: Accent = 'black';

const STORAGE_KEY = 'fajr-ui-accent';

function isAccent(value: unknown): value is Accent {
	return ACCENTS.some((accent) => accent.value === value);
}

/**
 * The accent is orthogonal to light and dark: `data-accent` on the root element
 * swaps only the primary surface, its foreground, the focus ring and the hue the
 * chart palette is built from, while the `.dark` class keeps owning the rest.
 * Either can change without touching the other.
 *
 * `black` sets no attribute at all — it is what the base tokens already are, so
 * the absence of an accent is itself a valid state rather than a special one.
 * It is named for the colour rather than for the mechanism, so the three read as
 * one set: Black, Orange, Blue.
 */
class AccentState {
	current = $state<Accent>(DEFAULT_ACCENT);

	constructor() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		// A stored value from a retired accent falls back rather than sticking.
		if (isAccent(stored)) this.current = stored;
		else if (stored) localStorage.removeItem(STORAGE_KEY);
	}

	set(accent: Accent): void {
		this.current = accent;
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, accent);
		this.apply();
	}

	apply(): void {
		if (!browser) return;
		const root = document.documentElement;
		if (this.current === 'black') root.removeAttribute('data-accent');
		else root.setAttribute('data-accent', this.current);
	}
}

export const accent = new AccentState();
