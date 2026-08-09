<script module lang="ts">
	export type DataTablePaginationProps = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		table: any;
		pageSizes?: number[];
		/** Shows "n of m selected" when the table has row selection enabled. */
		showSelection?: boolean;
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../button.svelte';
	import { Select, SelectItem } from '../select';

	let {
		table,
		pageSizes = [10, 20, 50, 100],
		showSelection = false,
		class: className
	}: DataTablePaginationProps = $props();

	/*
	 * v9 reads state through `table.atoms`, not the v8 `getState()` — that method
	 * does not exist here, and calling it fails during SSR before it ever reaches
	 * the browser.
	 */
	const state = $derived(table.atoms.pagination.get());
	const pageCount = $derived(table.getPageCount());
	// `getPageCount()` is -1 while a server-side table has not reported a row
	// count yet; showing "Page 1 of -1" is worse than showing nothing.
	const knownPages = $derived(pageCount >= 0);

	const selected = $derived(showSelection ? (table.getSelectedRowModel?.()?.rows?.length ?? 0) : 0);
</script>

<div
	data-slot="data-table-pagination"
	class={cn('flex flex-wrap items-center justify-between gap-3', className)}
>
	<p class="text-sm text-muted-foreground" aria-live="polite">
		{#if showSelection}
			{selected} of {table.getRowCount()} row{table.getRowCount() === 1 ? '' : 's'} selected.
		{:else if knownPages}
			Page {state.pageIndex + 1} of {Math.max(1, pageCount)} · {table.getRowCount()} rows
		{:else}
			Page {state.pageIndex + 1}
		{/if}
	</p>

	<div class="flex items-center gap-2">
		<label class="flex items-center gap-2 text-sm text-muted-foreground">
			Rows
			<!-- A function binding: the table owns the page size, so read and write go through it. -->
			<Select
				bind:value={() => String(state.pageSize), (next) => next && table.setPageSize(Number(next))}
				class="w-[4.5rem]"
				aria-label="Rows per page"
			>
				{#each pageSizes as size (size)}
					<SelectItem value={String(size)}>{size}</SelectItem>
				{/each}
			</Select>
		</label>

		<div class="flex items-center gap-1">
			<Button
				size="icon-sm"
				variant="outline"
				aria-label="First page"
				disabled={!table.getCanPreviousPage()}
				onclick={() => table.firstPage()}
			>
				<svg
					aria-hidden="true"
					class="rtl:-scale-x-100"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
				</svg>
			</Button>
			<Button
				size="icon-sm"
				variant="outline"
				aria-label="Previous page"
				disabled={!table.getCanPreviousPage()}
				onclick={() => table.previousPage()}
			>
				<svg
					aria-hidden="true"
					class="rtl:-scale-x-100"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			</Button>
			<Button
				size="icon-sm"
				variant="outline"
				aria-label="Next page"
				disabled={!table.getCanNextPage()}
				onclick={() => table.nextPage()}
			>
				<svg
					aria-hidden="true"
					class="rtl:-scale-x-100"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</Button>
			<Button
				size="icon-sm"
				variant="outline"
				aria-label="Last page"
				disabled={!table.getCanNextPage() || !knownPages}
				onclick={() => table.lastPage()}
			>
				<svg
					aria-hidden="true"
					class="rtl:-scale-x-100"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
				</svg>
			</Button>
		</div>
	</div>
</div>
