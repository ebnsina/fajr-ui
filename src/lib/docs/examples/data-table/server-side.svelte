<script lang="ts">
	import { untrack } from 'svelte';
	import {
		createTable,
		createTableState,
		columnFilteringFeature,
		globalFilteringFeature,
		rowPaginationFeature,
		rowSortingFeature,
		tableFeatures,
		sortFns,
		type ColumnDef,
		type PaginationState,
		type SortingState
	} from '@tanstack/svelte-table';
	import {
		DataTable,
		DataTablePagination,
		DataTableSearch,
		DataTableToolbar,
		DataTableFilter,
		Spinner
	} from '$lib/components/ui';
	import { DISCIPLINES, STATUSES, type Manuscript } from '$lib/data/manuscripts';
	import { queryManuscripts } from '$lib/data/manuscripts-query';

	/*
	 * No row models are registered. Without `filteredRowModel`, `sortedRowModel`
	 * or `paginatedRowModel` the table does no work on the rows it is given — it
	 * only tracks the state and reports it, which is exactly what you want when
	 * the server is doing the work. The `manual*` flags below say so explicitly.
	 */
	const features = tableFeatures({
		columnFilteringFeature,
		globalFilteringFeature,
		rowSortingFeature,
		rowPaginationFeature,
		sortFns
	});

	const columns: ColumnDef<typeof features, Manuscript>[] = [
		{ accessorKey: 'id', header: 'Reference', meta: { class: 'font-mono text-xs' } },
		{ accessorKey: 'title', header: 'Title', meta: { class: 'font-medium' } },
		{ accessorKey: 'scholar', header: 'Scholar' },
		{ accessorKey: 'city', header: 'City' },
		{
			accessorKey: 'folios',
			header: 'Folios',
			meta: { class: 'text-right tabular-nums', headerClass: 'text-end' }
		}
	];

	let rows = $state<Manuscript[]>([]);
	let rowCount = $state(0);
	let loading = $state(true);

	let search = $state('');
	let disciplines = $state<string[]>([]);
	let statuses = $state<string[]>([]);

	const [sorting, setSorting] = createTableState<SortingState>([{ id: 'folios', desc: true }]);
	const [pagination, setPagination] = createTableState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const table = createTable({
		features,
		columns,
		get data() {
			return rows;
		},
		// The server has already filtered, sorted and sliced; do not do it twice.
		manualFiltering: true,
		manualSorting: true,
		manualPagination: true,
		get rowCount() {
			return rowCount;
		},
		state: {
			get sorting() {
				return sorting();
			},
			get pagination() {
				return pagination();
			}
		},
		onSortingChange: setSorting,
		onPaginationChange: setPagination
	});

	/*
	 * One effect owns the request. `search` arrives already debounced from
	 * DataTableSearch, so a keystroke does not become a request; the sort and page
	 * changes are discrete and fire at most one request each.
	 *
	 * `queryManuscripts` stands in for the backend — it takes the same query the
	 * URL would carry and answers with the same `{ rows, rowCount }`. Point it at
	 * `fetch('/api/manuscripts?' + params)` and nothing below this line changes.
	 */
	$effect(() => {
		const [sort] = sorting();

		// An aborted request cannot land after a newer one and show stale rows.
		const controller = new AbortController();
		loading = true;
		queryManuscripts(
			{
				search,
				disciplines,
				statuses,
				sort: sort?.id,
				desc: sort?.desc,
				page: pagination().pageIndex,
				size: pagination().pageSize
			},
			{ signal: controller.signal }
		)
			.then((payload) => {
				rows = payload.rows;
				rowCount = payload.rowCount;
				loading = false;
			})
			.catch((error) => {
				if (error.name !== 'AbortError') loading = false;
			});

		return () => controller.abort();
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
		void disciplines;
		void statuses;
		untrack(() => setPagination((old) => ({ ...old, pageIndex: 0 })));
	});
</script>

<div class="flex w-full flex-col gap-3">
	<DataTableToolbar>
		<DataTableSearch bind:value={search} placeholder="Search the archive…" />
		<DataTableFilter label="Discipline" options={DISCIPLINES} bind:value={disciplines} />
		<DataTableFilter label="Status" options={STATUSES} bind:value={statuses} />
		{#if loading}
			<span class="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
				<Spinner class="size-4" /> Loading…
			</span>
		{/if}
	</DataTableToolbar>

	<DataTable {table} class={loading ? 'opacity-64 transition-opacity' : 'transition-opacity'}>
		{#snippet empty()}
			<span class="text-sm text-muted-foreground">
				{loading ? 'Loading…' : 'No manuscript matches those filters.'}
			</span>
		{/snippet}
	</DataTable>

	<DataTablePagination {table} />
</div>
