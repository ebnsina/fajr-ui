<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type DataTableProps = {
		/** A TanStack table instance created with `createTable`. */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		table: any;
		/** Shown when the table has no rows. */
		empty?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { FlexRender } from '@tanstack/svelte-table';
	import DataTableColumnHeader from './data-table-column-header.svelte';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';

	let { table, empty, class: className }: DataTableProps = $props();

	const rows = $derived(table.getRowModel().rows);
</script>

<!--
	Deliberately not virtualised. Pagination already bounds what is in the DOM, so
	a windowing layer would render the same ten rows through a great deal more
	machinery — and it forces the table into a CSS grid, which gives up the column
	sizing that a real `<table>` does for free. If a genuinely unpaginated view
	turns up, that is the moment to add it, not before.
-->
<div
	data-slot="data-table"
	class={cn(
		'relative w-full overflow-x-auto rounded-xl border bg-card not-dark:bg-clip-padding',
		className
	)}
>
	<Table>
		<TableHeader>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<TableRow>
					{#each headerGroup.headers as header (header.id)}
						<TableHead
							colspan={header.colSpan > 1 ? header.colSpan : undefined}
							aria-sort={header.column.getCanSort()
								? header.column.getIsSorted() === 'asc'
									? 'ascending'
									: header.column.getIsSorted() === 'desc'
										? 'descending'
										: 'none'
								: undefined}
							class={header.column.columnDef.meta?.class}
						>
							{#if !header.isPlaceholder}
								<!--
									The sort control wraps the column's own header content, so a
									column definition stays a plain string unless it wants more.
									`DataTableColumnHeader` falls back to a span when the column
									cannot be sorted.
								-->
								<DataTableColumnHeader {header}>
									<FlexRender {header} />
								</DataTableColumnHeader>
							{/if}
						</TableHead>
					{/each}
				</TableRow>
			{/each}
		</TableHeader>

		<TableBody>
			{#if rows.length === 0}
				<TableRow>
					<TableCell colspan={table.getAllLeafColumns().length} class="h-32 text-center">
						{#if empty}{@render empty()}{:else}
							<span class="text-sm text-muted-foreground">No results.</span>
						{/if}
					</TableCell>
				</TableRow>
			{:else}
				{#each rows as row (row.id)}
					<TableRow data-state={row.getIsSelected?.() ? 'selected' : undefined}>
						<!--
							`getAllCells` rather than `getVisibleCells`: the latter only exists
							once `columnVisibilityFeature` is registered, and this shell must
							work with whatever features the caller opted into.
						-->
						{#each row.getAllCells() as cell (cell.id)}
							<TableCell class={cell.column.columnDef.meta?.class}>
								<FlexRender {cell} />
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>
