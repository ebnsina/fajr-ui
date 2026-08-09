import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ToolbarFixture from './toolbar.fixture.svelte';

/*
 * A toolbar is one tab stop: Tab moves past it, arrows move within. Every
 * assertion below is about keeping that true — including while the toolbar's
 * own contents change, which is where it used to come apart.
 */

const root = () => document.querySelector('[role="toolbar"]')!;
const FOCUSABLE =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const items = () => [...root().querySelectorAll<HTMLElement>(FOCUSABLE)];
const stops = () => items().filter((item) => item.tabIndex === 0);

function press(key: string) {
	root().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

const settle = () => new Promise((r) => setTimeout(r, 20));

describe('roving tab index', () => {
	it('leaves exactly one tab stop', async () => {
		render(ToolbarFixture, {});
		await settle();
		expect(stops()).toHaveLength(1);
	});

	it('starts on the first item', async () => {
		render(ToolbarFixture, {});
		await settle();
		expect(stops()[0]).toBe(items()[0]);
	});

	it('moves the tab stop with the arrow keys', async () => {
		render(ToolbarFixture, {});
		await settle();
		items()[0].focus();
		press('ArrowRight');
		await settle();
		expect(stops()).toHaveLength(1);
		expect(stops()[0]).toBe(items()[1]);
	});

	it('wraps at the end', async () => {
		render(ToolbarFixture, {});
		await settle();
		const list = items();
		list[list.length - 1].focus();
		press('ArrowRight');
		await settle();
		expect(stops()[0]).toBe(items()[0]);
	});

	it('jumps to the ends with Home and End', async () => {
		render(ToolbarFixture, {});
		await settle();
		items()[0].focus();
		press('End');
		await settle();
		expect(stops()[0]).toBe(items().at(-1));
		press('Home');
		await settle();
		expect(stops()[0]).toBe(items()[0]);
	});
});

describe('when the contents change', () => {
	it('does not gain a second tab stop when an item appears', async () => {
		// The regression: the effect only tracked the root element, and the item
		// list is read from the DOM, so a conditionally rendered button arrived
		// with its own default tabindex and the toolbar quietly had two tab stops.
		const screen = render(ToolbarFixture, { extra: false });
		await settle();
		await screen.rerender({ extra: true });
		await settle();
		expect(items().length).toBe(4);
		expect(stops()).toHaveLength(1);
	});

	it('does not lose its only tab stop when that item is removed', async () => {
		// Zero tab stops is the worse half of the same bug: Tab skips the toolbar
		// entirely and its controls become unreachable.
		const screen = render(ToolbarFixture, { extra: true });
		await settle();
		items().at(-1)!.focus();
		press('End');
		await settle();
		expect(stops()[0]).toBe(items().at(-1));

		await screen.rerender({ extra: false });
		await settle();
		expect(stops()).toHaveLength(1);
	});

	it('picks a newly enabled item up as an item', async () => {
		const screen = render(ToolbarFixture, { disabledLast: true });
		await settle();
		const before = items().length;
		await screen.rerender({ disabledLast: false });
		await settle();
		expect(items().length).toBe(before + 1);
		expect(stops()).toHaveLength(1);
	});
});

describe('text fields inside a toolbar', () => {
	it('keep their own arrow keys', async () => {
		// Roving focus was swallowing them, so the caret could not be moved and
		// text could not be selected — every Left threw focus onto a button.
		render(ToolbarFixture, { withInput: true });
		await settle();
		const input = root().querySelector('input')!;
		input.focus();
		const event = new KeyboardEvent('keydown', {
			key: 'ArrowLeft',
			bubbles: true,
			cancelable: true
		});
		input.dispatchEvent(event);
		await settle();
		expect(event.defaultPrevented).toBe(false);
		expect(document.activeElement).toBe(input);
	});
});
