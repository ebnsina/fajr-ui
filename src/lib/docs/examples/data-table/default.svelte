<script lang="ts">
	import { untrack } from 'svelte';
	import {
		createTable,
		createTableState,
		createFilteredRowModel,
		createPaginatedRowModel,
		createSortedRowModel,
		columnFilteringFeature,
		globalFilteringFeature,
		rowPaginationFeature,
		rowSortingFeature,
		tableFeatures,
		filterFn_includesString,
		filterFn_arrIncludesSome,
		sortFns,
		type ColumnDef,
		type PaginationState,
		type SortingState
	} from '@tanstack/svelte-table';
	import {
		DataTable,
		DataTableFilter,
		DataTablePagination,
		DataTableSearch,
		DataTableToolbar
	} from '$lib/components/ui';
	import { DISCIPLINES, STATUSES, makeManuscripts, type Manuscript } from '$lib/data/manuscripts';

	// Everything is in memory, so the table does the filtering, sorting and
	// slicing itself — no request is made when you type or sort.
	const data = makeManuscripts(2000);

	const features = tableFeatures({
		columnFilteringFeature,
		globalFilteringFeature,
		rowSortingFeature,
		rowPaginationFeature,
		filteredRowModel: createFilteredRowModel(),
		sortedRowModel: createSortedRowModel(),
		paginatedRowModel: createPaginatedRowModel(),
		filterFns: {
			includesString: filterFn_includesString,
			arrIncludesSome: filterFn_arrIncludesSome
		},
		sortFns
	});

	const columns: ColumnDef<typeof features, Manuscript>[] = [
		{ accessorKey: 'id', header: 'Reference', meta: { class: 'font-mono text-xs' } },
		{ accessorKey: 'title', header: 'Title', meta: { class: 'font-medium' } },
		{ accessorKey: 'scholar', header: 'Scholar' },
		{ accessorKey: 'city', header: 'City' },
		{ accessorKey: 'discipline', header: 'Discipline', filterFn: 'arrIncludesSome' },
		{ accessorKey: 'status', header: 'Status', filterFn: 'arrIncludesSome' },
		{ accessorKey: 'folios', header: 'Folios', meta: { class: 'text-right tabular-nums' } }
	];

	let search = $state('');
	let disciplines = $state<string[]>([]);
	let statuses = $state<string[]>([]);

	const [sorting, setSorting] = createTableState<SortingState>([{ id: 'title', desc: false }]);
	const [pagination, setPagination] = createTableState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const columnFilters = $derived([
		...(disciplines.length ? [{ id: 'discipline', value: disciplines }] : []),
		...(statuses.length ? [{ id: 'status', value: statuses }] : [])
	]);

	const table = createTable({
		features,
		columns,
		get data() {
			return data;
		},
		state: {
			get sorting() {
				return sorting();
			},
			get pagination() {
				return pagination();
			},
			get globalFilter() {
				return search;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		globalFilterFn: 'includesString',
		onSortingChange: setSorting,
		onPaginationChange: setPagination
	});

	/*
	 * A narrowed result set can leave you stranded past the last page.
	 *
	 * The write is untracked: the functional updater reads the current pagination
	 * to spread it, and that read would otherwise become a dependency of this
	 * effect — so setting the page would retrigger the effect that set it.
	 */
	$effect(() => {
		void search;
		void columnFilters;
		untrack(() => setPagination((old) => ({ ...old, pageIndex: 0 })));
	});
</script>

<div class="flex w-full flex-col gap-3">
	<DataTableToolbar>
		<DataTableSearch bind:value={search} placeholder="Search manuscripts…" />
		<DataTableFilter label="Discipline" options={DISCIPLINES} bind:value={disciplines} />
		<DataTableFilter label="Status" options={STATUSES} bind:value={statuses} />
	</DataTableToolbar>

	<DataTable {table}>
		{#snippet empty()}
			<span class="text-sm text-muted-foreground">No manuscript matches those filters.</span>
		{/snippet}
	</DataTable>

	<DataTablePagination {table} />
</div>
