<script lang="ts">
	import { Chart } from '$lib/components/ui';
	import { barY, defineChart, scaleBand, scaleLinear, tooltip } from '$lib/internal/chart';

	const folios = [
		{ month: 'Muharram', copied: 128 },
		{ month: 'Safar', copied: 164 },
		{ month: 'Rabi I', copied: 141 },
		{ month: 'Rabi II', copied: 197 },
		{ month: 'Jumada I', copied: 172 },
		{ month: 'Jumada II', copied: 214 }
	];

	const definition = defineChart({
		marks: [barY(folios, { x: 'month', y: 'copied', fill: 'var(--chart-1)', radius: 6 })],
		// Padding on the band, or the bars butt against each other and read as one
		// filled area rather than as six separate figures.
		x: { scale: () => scaleBand<string>().padding(0.28) },
		y: { scale: scaleLinear, nice: true, grid: true },
		// Left to itself the tooltip labels its rows `x` and `y`, which are the
		// channel names rather than anything the reader asked about.
		tooltip: {
			use: tooltip,
			items: [
				{ channel: 'x', label: 'Month' },
				{ channel: 'y', label: 'Folios' }
			]
		}
	});
</script>

<div class="w-full max-w-2xl">
	<Chart {definition} label="Folios copied per month" height={220} />
</div>
