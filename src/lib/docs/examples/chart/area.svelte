<script lang="ts">
	import { Chart } from '$lib/components/ui';
	import { areaY, defineChart, scaleLinear, scalePoint, tooltip } from '$lib/internal/chart';

	const holdings = [
		{ year: '1250', works: 410 },
		{ year: '1260', works: 640 },
		{ year: '1270', works: 980 },
		{ year: '1280', works: 1420 },
		{ year: '1290', works: 1810 },
		{ year: '1300', works: 2350 }
	];

	const definition = defineChart({
		marks: [
			areaY(holdings, {
				x: 'year',
				y: 'works',
				fill: 'var(--chart-1)',
				fillOpacity: 0.24,
				stroke: 'var(--chart-1)'
			})
		],
		x: { scale: () => scalePoint<string>().padding(0) },
		y: { scale: scaleLinear, nice: true, grid: true },
		tooltip
	});
</script>

<div class="w-full max-w-2xl">
	<Chart {definition} label="Works held, by decade" height={220} />
</div>
