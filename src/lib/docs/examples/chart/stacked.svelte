<script lang="ts">
	import { Chart, ChartLegend } from '$lib/components/ui';
	import { barY, defineChart, scaleBand, scaleLinear, stack, tooltip } from '$lib/internal/chart';

	const work = [
		{ month: 'Muharram', task: 'Copying', folios: 128 },
		{ month: 'Muharram', task: 'Binding', folios: 42 },
		{ month: 'Safar', task: 'Copying', folios: 164 },
		{ month: 'Safar', task: 'Binding', folios: 51 },
		{ month: 'Rabi I', task: 'Copying', folios: 141 },
		{ month: 'Rabi I', task: 'Binding', folios: 38 },
		{ month: 'Rabi II', task: 'Copying', folios: 197 },
		{ month: 'Rabi II', task: 'Binding', folios: 64 }
	];

	// `color` names the series and takes the next palette slot for each one, so
	// the colours come from the theme tokens rather than being written per bar.
	// `order` is explicit: left to itself the stack would reorder as the data
	// changes, and a legend that swaps meaning is worse than no legend.
	const definition = defineChart({
		marks: [
			barY(work, {
				x: 'month',
				y: 'folios',
				color: 'task',
				layout: stack({ order: ['Copying', 'Binding'] })
			})
		],
		x: { scale: () => scaleBand<string>().padding(0.28) },
		y: { scale: scaleLinear, nice: true, grid: true },
		tooltip
	});
</script>

<div class="w-full max-w-2xl">
	<Chart {definition} label="Scriptorium output by task, per month" height={220}>
		<ChartLegend
			items={[
				{ label: 'Copying', series: 1 },
				{ label: 'Binding', series: 2 }
			]}
		/>
	</Chart>
</div>
