<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type ComboboxListProps = {
		side?: Side;
		align?: Align;
		label?: string;
		class?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import PopoverPopup from '../popover/popover-popup.svelte';
	import { useCombobox } from './context.svelte';

	let {
		side = 'bottom',
		align = 'start',
		label = 'Suggestions',
		class: className,
		children
	}: ComboboxListProps = $props();

	const combobox = useCombobox();
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		combobox.list = element;
		combobox.sync();
	});
</script>

<PopoverPopup
	open={combobox.open}
	anchor={combobox.anchor}
	{side}
	{align}
	role="listbox"
	manageFocus={false}
	id={combobox.listId}
	aria-label={label}
	class={cn('max-h-72 min-w-(--anchor-width) overflow-y-auto p-1', className)}
	style="--anchor-width: {combobox.anchor?.offsetWidth ?? 0}px"
>
	<!--
		`group/list` lets the empty state show only when nothing survived filtering,
		using `:has()` rather than a count threaded through state.
	-->
	<div bind:this={element} class="group/list flex flex-col gap-0.5">
		{@render children?.()}
	</div>
</PopoverPopup>
