<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type MeterIndicatorProps = HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useMeter } from './context.svelte';

	let { class: className, ...rest }: MeterIndicatorProps = $props();

	const meter = useMeter();
</script>

<div
	data-slot="meter-indicator"
	class={cn(
		'h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none',
		className
	)}
	style="width: {meter.percent}%"
	{...rest}
></div>
