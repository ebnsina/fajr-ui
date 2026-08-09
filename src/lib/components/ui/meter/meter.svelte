<script module lang="ts">
	import type { MeterRootProps } from './meter-root.svelte';

	export type MeterProps = Omit<MeterRootProps, 'children'> & {
		/** Formats the displayed value; omit to show the bar alone. */
		format?: (value: number, max: number) => string;
	};
</script>

<script lang="ts">
	import MeterRoot from './meter-root.svelte';
	import MeterTrack from './meter-track.svelte';
	import MeterIndicator from './meter-indicator.svelte';
	import MeterLabel from './meter-label.svelte';
	import MeterValue from './meter-value.svelte';

	let { format, label = 'Meter', ...rest }: MeterProps = $props();
</script>

<MeterRoot {label} {...rest}>
	{#if format}
		<div class="flex items-center justify-between">
			<MeterLabel>{label}</MeterLabel>
			<MeterValue {format} />
		</div>
	{/if}
	<MeterTrack>
		<MeterIndicator />
	</MeterTrack>
</MeterRoot>
