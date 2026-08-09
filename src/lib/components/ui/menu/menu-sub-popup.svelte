<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type MenuSubPopupProps = {
		class?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { isRTL } from '$lib/internal/rtl';
	import PopoverPopup from '../popover/popover-popup.svelte';
	import { MenuState, setMenuContext } from './context.svelte';
	import { requireMenuSub } from './sub-context.svelte';

	let { class: className, children }: MenuSubPopupProps = $props();

	const sub = requireMenuSub();

	let panel = $state<HTMLElement | null>(null);

	// A submenu is its own menu for keyboard purposes, so items inside it are
	// navigated by this context rather than the parent's.
	const menu = setMenuContext(
		new MenuState({
			close: () => sub.close(),
			panel: () => panel
		})
	);

	$effect(() => {
		if (sub.open && panel) menu.focusFirst();
	});

	function onkeydown(event: KeyboardEvent) {
		/*
		 * The arrow that closes a submenu is the one pointing back toward its
		 * parent — Left in a left-to-right menu, Right in a right-to-left one.
		 * It is checked here rather than as a `case` because which key it is
		 * cannot be known until the menu is laid out.
		 */
		if (event.key === (isRTL(event.currentTarget as Element) ? 'ArrowRight' : 'ArrowLeft')) {
			event.preventDefault();
			event.stopPropagation();
			sub.close();
			document.getElementById(sub.triggerId)?.focus();
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				menu.move(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				menu.move(-1);
				return;
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				sub.close();
				document.getElementById(sub.triggerId)?.focus();
				return;
			case 'Home':
				event.preventDefault();
				menu.focusFirst();
				return;
			case 'End':
				event.preventDefault();
				menu.focusLast();
				return;
		}

		if (!event.metaKey && !event.ctrlKey && !event.altKey && menu.typeahead(event.key)) {
			event.preventDefault();
		}
	}
</script>

<PopoverPopup
	open={sub.open}
	anchor={sub.anchor}
	side="right"
	align="start"
	offset={-4}
	role="menu"
	manageFocus={false}
	aria-labelledby={sub.triggerId}
	id={sub.popupId}
	{onkeydown}
	class={cn('min-w-44 p-1', className)}
>
	<div
		bind:this={panel}
		class="flex flex-col gap-0.5"
		onpointerenter={() => sub.cancelClose()}
		onpointerleave={(event) => sub.scheduleClose(event, panel)}
		role="presentation"
	>
		{@render children?.()}
	</div>
</PopoverPopup>
