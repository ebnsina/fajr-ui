<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { PopoverPopupProps } from '../popover/popover-popup.svelte';

	export type MenuProps = Omit<PopoverPopupProps, 'role' | 'manageFocus'> & {
		/** Which end to focus when opened — Up-arrow opening lands on the last item. */
		autoFocus?: 'first' | 'last';
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import PopoverPopup from '../popover/popover-popup.svelte';
	import { MenuState, setMenuContext } from './context.svelte';

	let {
		class: className,
		open = $bindable(false),
		anchor = null,
		side = 'bottom',
		align = 'start',
		autoFocus = 'first',
		label,
		children,
		...rest
	}: MenuProps = $props();

	let panel = $state<HTMLElement | null>(null);

	const menu = setMenuContext(
		new MenuState({
			close: () => (open = false),
			panel: () => panel
		})
	);

	let closedByTab = false;

	// Focus an item rather than the panel, so the first arrow press moves to the
	// second item instead of merely entering the list.
	$effect(() => {
		if (!open || !panel) return;
		const previous = document.activeElement as HTMLElement | null;
		if (autoFocus === 'last') menu.focusLast();
		else menu.focusFirst();
		const list = panel;
		/*
		 * Return focus only if it is still ours to move.
		 *
		 * Restoring unconditionally is a focus steal: a non-modal panel can be left
		 * open while the user tabs on or clicks something else, and closing it then
		 * yanked them back to the trigger — the next Tab resumed from the wrong
		 * place. `body` counts as ours because that is where focus lands when the
		 * element it was on has just been removed.
		 */
		return () => {
			/*
			 * Tab is the exception: the browser has already moved focus onward by
			 * the time this cleanup runs, and pulling it back would make Tab out of
			 * an open menu land on the menu button again.
			 */
			if (closedByTab) {
				closedByTab = false;
				return;
			}
			const active = document.activeElement;
			if (list.contains(active) || active === document.body || active === null) {
				previous?.focus({ preventScroll: true });
			}
		};
	});

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				menu.move(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				menu.move(-1);
				return;
			case 'Home':
				event.preventDefault();
				menu.focusFirst();
				return;
			case 'End':
				event.preventDefault();
				menu.focusLast();
				return;
			case 'Tab':
				// Tabbing out of a menu closes it rather than walking the page behind.
				// The browser's own move happens after this, so the close must not
				// then drag focus back to the trigger.
				closedByTab = true;
				open = false;
				return;
		}

		if (!event.metaKey && !event.ctrlKey && !event.altKey && menu.typeahead(event.key)) {
			event.preventDefault();
		}
	}
</script>

<PopoverPopup
	bind:open
	{anchor}
	{side}
	{align}
	{label}
	role="menu"
	manageFocus={false}
	{onkeydown}
	class={cn('min-w-44 p-1', className)}
	{...rest}
>
	<div bind:this={panel} class="flex flex-col gap-0.5">
		{@render children?.()}
	</div>
</PopoverPopup>
