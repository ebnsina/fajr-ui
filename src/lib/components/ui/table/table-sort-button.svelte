<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SortDirection = 'ascending' | 'descending' | null;

	export type TableSortButtonProps = HTMLButtonAttributes & {
		/** Current direction for this column; `null` when unsorted. */
		direction?: SortDirection;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		direction = null,
		onclick,
		children,
		...rest
	}: TableSortButtonProps = $props();
</script>

<!--
	The sort state belongs on the `<th>` via `aria-sort`, which this button's
	parent sets — a button cannot carry it. Here the arrow only reflects it,
	so it is hidden from assistive technology.
-->
<button
	type="button"
	data-slot="table-sort-button"
	data-direction={direction ?? undefined}
	{onclick}
	class={cn(
		'-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
		direction && 'text-foreground',
		className
	)}
	{...rest}
>
	{@render children?.()}
	<svg
		aria-hidden="true"
		class={cn('size-3.5 shrink-0 transition-opacity', direction ? 'opacity-100' : 'opacity-40')}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		{#if direction === 'ascending'}
			<path d="m5 15 7-7 7 7" />
		{:else if direction === 'descending'}
			<path d="m19 9-7 7-7-7" />
		{:else}
			<path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
		{/if}
	</svg>
</button>
