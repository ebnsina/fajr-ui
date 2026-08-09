<script lang="ts">
	import { Chart } from '$lib/components/ui';
	import { defineChart, lineY, scaleLinear, scalePoint, tooltip } from '$lib/internal/chart';

	const observations = [
		{ month: 'Muharram', nights: 12 },
		{ month: 'Safar', nights: 18 },
		{ month: 'Rabi I', nights: 9 },
		{ month: 'Rabi II', nights: 21 },
		{ month: 'Jumada I', nights: 17 },
		{ month: 'Jumada II', nights: 24 }
	];

	const definition = defineChart({
		marks: [
			lineY(observations, {
				x: 'month',
				y: 'nights',
				points: true,
				stroke: 'var(--chart-1)'
			})
		],
		x: { scale: () => scalePoint<string>().padding(0.2) },
		y: { scale: scaleLinear, nice: true, grid: true },
		tooltip
	});
</script>

<div class="w-full max-w-2xl">
	<Chart {definition} label="Nights of observation per month" height={220} />
</div>
