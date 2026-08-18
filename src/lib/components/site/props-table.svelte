<script module lang="ts">
	export type PropRow = {
		name: string;
		type: string;
		default?: string;
		description: string;
	};

	export type PropsTableProps = {
		/** Heading for the table, e.g. the component or part name. */
		title?: string;
		rows: PropRow[];
	};
</script>

<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui';

	let { title, rows }: PropsTableProps = $props();
</script>

<div class="not-prose flex flex-col gap-3">
	{#if title}
		<h3 class="font-mono text-sm font-medium">{title}</h3>
	{/if}
	<!-- Scrolls on its own so a wide type signature never widens the page. -->
	<div class="overflow-x-auto rounded-xl border bg-background">
		<Table class="min-w-[36rem]">
			<TableHeader>
				<TableRow>
					<TableHead>Prop</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Default</TableHead>
					<TableHead>Description</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each rows as row (row.name)}
					<TableRow>
						<TableCell class="align-top font-mono text-xs font-medium">{row.name}</TableCell>
						<TableCell class="align-top font-mono text-xs text-muted-foreground">
							{row.type}
						</TableCell>
						<TableCell class="align-top font-mono text-xs text-muted-foreground">
							{row.default ?? '—'}
						</TableCell>
						<TableCell class="align-top text-muted-foreground">{row.description}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
