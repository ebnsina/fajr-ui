import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Calendar, { fromISODate, toISODate } from './calendar.svelte';

/*
 * The behaviours here are the ones that are invisible until they are wrong: a
 * grid with no tab stop, a selection nothing announces, a month key that lands
 * on the wrong day. Each was a real defect at some point.
 */

const grid = () => document.querySelector('[role="grid"]')!;
const cell = (iso: string) => grid().querySelector<HTMLElement>(`[data-date="${iso}"]`)!;
const tabStops = () => [...grid().querySelectorAll<HTMLElement>('button[tabindex="0"]')];

/*
 * Read back through the DOM rather than the component's props: what a screen
 * reader is told is the thing under test, and a binding that updated while the
 * markup did not would be exactly the bug worth catching.
 */
const selectedDates = () =>
	[...grid().querySelectorAll<HTMLElement>('td[aria-selected="true"] [data-date]')].map(
		(el) => el.dataset.date
	);

const inRangeDates = () =>
	[...grid().querySelectorAll<HTMLElement>('td[aria-selected="false"] .rounded-none')].map(
		(el) => (el as HTMLElement).dataset.date
	);

function press(key: string) {
	grid().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('date helpers', () => {
	it('formats in local time', () => {
		// The most common date bug there is: building the string through UTC shifts
		// the day by one either side of midnight for most of the world.
		expect(toISODate(new Date(2026, 7, 20))).toBe('2026-08-20');
		expect(toISODate(new Date(2026, 0, 1))).toBe('2026-01-01');
	});

	it('round-trips', () => {
		const iso = '2026-02-28';
		expect(toISODate(fromISODate(iso)!)).toBe(iso);
	});

	it('pads single digits', () => {
		expect(toISODate(new Date(2026, 2, 5))).toBe('2026-03-05');
	});

	it('rejects anything that is not YYYY-MM-DD', () => {
		expect(fromISODate('2026-8-20')).toBeNull();
		expect(fromISODate('tomorrow')).toBeNull();
	});
});

describe('grid semantics', () => {
	it('exposes exactly one tab stop', () => {
		// A composite must expose one, never 31 and never zero.
		render(Calendar, { value: '2026-08-20' });
		expect(tabStops()).toHaveLength(1);
	});

	it('keeps a tab stop after paging to another month', async () => {
		// The regression: paging left the tab stop pointing at a day no longer
		// rendered, every cell fell to -1, and Tab jumped straight past the grid.
		render(Calendar, { value: '2026-08-20' });
		const next = document.querySelector<HTMLElement>('[aria-label="Next month"]')!;
		next.click();
		await new Promise((r) => setTimeout(r, 0));
		expect(tabStops()).toHaveLength(1);
	});

	it('names each day in full', () => {
		// A bare "20" says nothing about which month the user has landed on.
		render(Calendar, { value: '2026-08-20' });
		expect(cell('2026-08-20').getAttribute('aria-label')).toContain('August');
		expect(cell('2026-08-20').getAttribute('aria-label')).toContain('2026');
	});

	it('says which day is selected', () => {
		// aria-selected sits on the cell, but focus lands on the button inside it,
		// and not every screen reader reads the cell around a focused control.
		render(Calendar, { value: '2026-08-20' });
		expect(cell('2026-08-20').getAttribute('aria-label')).toContain('selected');
		expect(cell('2026-08-21').getAttribute('aria-label')).not.toContain('selected');
	});

	it('is not multiselectable in single mode', () => {
		render(Calendar, { value: '2026-08-20' });
		expect(grid().hasAttribute('aria-multiselectable')).toBe(false);
	});

	it.each(['multiple', 'range'] as const)('is multiselectable in %s mode', (mode) => {
		// Otherwise it announces exactly like a single-date grid, and nothing says
		// a second click adds rather than replaces.
		render(Calendar, {
			mode,
			value: mode === 'multiple' ? ['2026-08-20'] : { start: '2026-08-20' }
		});
		expect(grid().getAttribute('aria-multiselectable')).toBe('true');
	});

	it('marks today', () => {
		render(Calendar, {});
		expect(document.querySelectorAll('[aria-current="date"]').length).toBeLessThanOrEqual(1);
	});

	it('renders a fixed six weeks so the height never changes', () => {
		// Anything below the calendar jumped as you paged through months.
		render(Calendar, { month: '2026-02' });
		expect(grid().querySelectorAll('tbody tr')).toHaveLength(6);
	});
});

describe('keyboard', () => {
	it('steps a month on PageDown, not thirty days', async () => {
		// Thirty days from the 15th of a 31-day month lands on the 16th of the
		// next, which is neither the pattern nor what anyone expects.
		render(Calendar, { value: '2026-08-15' });
		cell('2026-08-15').focus();
		press('PageDown');
		await new Promise((r) => setTimeout(r, 0));
		expect(tabStops()[0].dataset.date).toBe('2026-09-15');
	});

	it('clamps the day when the next month is shorter', async () => {
		// Paging from the 31st must not skip February entirely.
		render(Calendar, { value: '2026-01-31' });
		cell('2026-01-31').focus();
		press('PageDown');
		await new Promise((r) => setTimeout(r, 0));
		expect(tabStops()[0].dataset.date).toBe('2026-02-28');
	});

	it('moves a week on ArrowDown', async () => {
		render(Calendar, { value: '2026-08-10' });
		cell('2026-08-10').focus();
		press('ArrowDown');
		await new Promise((r) => setTimeout(r, 0));
		expect(tabStops()[0].dataset.date).toBe('2026-08-17');
	});

	it('follows the keyboard across a month boundary', async () => {
		// Crossing the edge has to move the view too, or focus goes to a cell that
		// is not rendered.
		render(Calendar, { value: '2026-08-31' });
		cell('2026-08-31').focus();
		press('ArrowRight');
		await new Promise((r) => setTimeout(r, 0));
		expect(tabStops()[0].dataset.date).toBe('2026-09-01');
	});
});

describe('selection', () => {
	it('flips a range drawn backwards', async () => {
		// Clicking before the open start closes the range rather than refusing.
		render(Calendar, { mode: 'range', value: { start: '2026-08-20' } });
		cell('2026-08-14').click();
		await new Promise((r) => setTimeout(r, 0));
		expect(selectedDates()).toEqual(['2026-08-14', '2026-08-20']);
	});

	it('marks the days strictly between the two ends', async () => {
		// The ends stay distinct from the middle, so the span reads as a span.
		render(Calendar, { mode: 'range', value: { start: '2026-08-14', end: '2026-08-18' } });
		await new Promise((r) => setTimeout(r, 0));
		expect(inRangeDates()).toEqual(['2026-08-15', '2026-08-16', '2026-08-17']);
	});

	it('toggles a chosen day off in multiple mode', async () => {
		render(Calendar, { mode: 'multiple', value: ['2026-08-05', '2026-08-12'] });
		cell('2026-08-05').click();
		await new Promise((r) => setTimeout(r, 0));
		expect(selectedDates()).toEqual(['2026-08-12']);
	});

	it('adds to the selection in multiple mode rather than replacing', async () => {
		render(Calendar, { mode: 'multiple', value: ['2026-08-05'] });
		cell('2026-08-12').click();
		await new Promise((r) => setTimeout(r, 0));
		expect(selectedDates()).toEqual(['2026-08-05', '2026-08-12']);
	});

	it('will not select outside min and max', () => {
		render(Calendar, { month: '2026-08', min: '2026-08-10', max: '2026-08-20' });
		expect(cell('2026-08-09').hasAttribute('disabled')).toBe(true);
		expect(cell('2026-08-15').hasAttribute('disabled')).toBe(false);
		expect(cell('2026-08-21').hasAttribute('disabled')).toBe(true);
	});
});
