<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComponentProps } from 'svelte';
	import { Chart as ChartSurface } from '@tanstack/svelte-charts';

	type SurfaceProps = ComponentProps<typeof ChartSurface>;

	export type ChartProps = {
		/** Built with `defineChart` — see `$lib/internal/chart`. */
		definition: SurfaceProps['definition'];
		/**
		 * What the chart says, in a sentence. Required: a chart is an image made
		 * of numbers, and without this a screen reader reaches a blank region.
		 */
		label: string;
		/** Fixed height in pixels. Give this or `aspectRatio`, not both. */
		height?: number;
		/** Height as a ratio of the measured width, e.g. `16 / 9`. */
		aspectRatio?: number;
		/**
		 * Width assumed on the server and for the first frame, before the
		 * container has been measured. Only affects what renders pre-measurement.
		 */
		initialWidth?: number;
		class?: string;
		/** Rendered above the plot — a legend, a title, a filter. */
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { CHART_PALETTE } from '$lib/internal/chart';

	let {
		definition,
		label,
		height,
		aspectRatio,
		initialWidth = 640,
		class: className,
		children
	}: ChartProps = $props();

	// One of the two, never neither: without a height the surface collapses, and
	// a chart of zero pixels is a bug that only shows up on someone else's screen.
	const size = $derived(aspectRatio !== undefined ? { aspectRatio } : { height: height ?? 240 });
</script>

<!--
	The palette is set here rather than globally so two charts on one page can
	differ, and `color` is set explicitly because the library draws its chrome —
	axes, grids, tick labels, tooltip border — in `currentColor`. Inheriting
	whatever colour happened to be in force would leave the axes the colour of
	the surrounding prose.
-->
<figure
	data-slot="chart"
	class={cn('flex w-full min-w-0 flex-col gap-3 text-muted-foreground', className)}
	style={CHART_PALETTE}
>
	{#if children}
		<figcaption class="contents">{@render children()}</figcaption>
	{/if}

	<!--
		`ariaLabel` gives the plot an accessible name; the library also renders a
		keyboard-reachable summary of the series behind it, so the figure is not a
		dead end for anyone who cannot see it.
	-->
	<ChartSurface {definition} ariaLabel={label} {initialWidth} {...size} class="w-full min-w-0" />
</figure>
