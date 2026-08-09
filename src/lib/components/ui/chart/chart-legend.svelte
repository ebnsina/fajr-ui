<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type ChartSeries = {
		label: string;
		/**
		 * Which slot of the palette this series uses, 1-based, matching the
		 * `--chart-N` token the mark was given.
		 */
		series: 1 | 2 | 3 | 4 | 5;
		/** Shown after the label — a total, a change, whatever the series is about. */
		value?: string;
	};

	export type ChartLegendProps = HTMLAttributes<HTMLUListElement> & {
		items: ChartSeries[];
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, items, ...rest }: ChartLegendProps = $props();

	/**
	 * Written out rather than built from the index, because Tailwind scans source
	 * as text — a class assembled at runtime is never generated.
	 */
	const SWATCH: Record<number, string> = {
		1: 'bg-chart-1',
		2: 'bg-chart-2',
		3: 'bg-chart-3',
		4: 'bg-chart-4',
		5: 'bg-chart-5'
	};
</script>

<!--
	A list, not a row of divs: a legend is an enumeration of the series, and
	saying so is free. The swatch is decorative — the label carries the meaning,
	so colour is never the only thing distinguishing one series from another.
-->
<ul
	data-slot="chart-legend"
	class={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm', className)}
	{...rest}
>
	{#each items as item (item.label)}
		<li class="flex items-center gap-2">
			<span aria-hidden="true" class="size-2.5 shrink-0 rounded-sm {SWATCH[item.series]}"></span>
			<span class="text-foreground">{item.label}</span>
			{#if item.value}
				<span class="tabular-nums">{item.value}</span>
			{/if}
		</li>
	{/each}
</ul>
