<script lang="ts">
	import { Chart } from '$lib/components/ui';
	import { barY, defineChart, scaleBand, scaleLinear, tooltip } from '$lib/internal/chart';

	const readers = [
		{ day: 'Sat', count: 34 },
		{ day: 'Sun', count: 41 },
		{ day: 'Mon', count: 58 },
		{ day: 'Tue', count: 62 },
		{ day: 'Wed', count: 49 },
		{ day: 'Thu', count: 71 },
		{ day: 'Fri', count: 12 }
	];

	// The builder receives the measured surface, so the chart can decide how much
	// detail fits rather than drawing seven labels into 300 pixels and letting
	// them collide.
	const definition = defineChart({
		chart: ({ width }) => ({
			marks: [barY(readers, { x: 'day', y: 'count', fill: 'var(--chart-1)', radius: 6 })],
			x: { scale: () => scaleBand<string>().padding(0.28) },
			y: { scale: scaleLinear, nice: true, grid: true, ticks: width < 420 ? 3 : 6 }
		}),
		tooltip
	});
</script>

<div class="w-full max-w-2xl">
	<Chart {definition} label="Readers in the hall, by day" aspectRatio={16 / 6} />
</div>
