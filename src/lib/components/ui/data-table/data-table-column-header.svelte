<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type DataTableColumnHeaderProps = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		header: any;
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { header, children, class: className }: DataTableColumnHeaderProps = $props();

	const column = $derived(header.column);
	const sorted = $derived(column.getIsSorted());
</script>

<!--
	`aria-sort` lives on the `<th>`, not here — a screen reader reads the sort
	state from the column header cell, and this button only has to describe what
	activating it will do.
-->
{#if column.getCanSort()}
	<button
		type="button"
		data-slot="data-table-column-header"
		onclick={column.getToggleSortingHandler()}
		class={cn(
			'-mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-1 font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[sorted]:text-foreground',
			className
		)}
		data-sorted={sorted || undefined}
		title={sorted === 'asc'
			? 'Sorted ascending'
			: sorted === 'desc'
				? 'Sorted descending'
				: 'Not sorted'}
	>
		{@render children?.()}
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class={cn('size-3.5 shrink-0 transition-opacity', sorted ? 'opacity-100' : 'opacity-40')}
		>
			{#if sorted === 'asc'}
				<path d="m18 15-6-6-6 6" />
			{:else if sorted === 'desc'}
				<path d="m6 9 6 6 6-6" />
			{:else}
				<path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
			{/if}
		</svg>
	</button>
{:else}
	<span class={cn('font-medium text-muted-foreground', className)}>{@render children?.()}</span>
{/if}
