<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MeterRootProps = HTMLAttributes<HTMLDivElement> & {
		value?: number;
		min?: number;
		max?: number;
		/** Fallback accessible name when no `<MeterLabel>` is rendered. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { MeterState, setMeterContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		value = 0,
		min = 0,
		max = 100,
		label = 'Meter',
		children,
		...rest
	}: MeterRootProps = $props();

	const meter = setMeterContext(
		new MeterState({
			value: () => value,
			min: () => min,
			max: () => max,
			labelId: `${baseId}-label`
		})
	);
</script>

<!--
	A meter reports a measurement inside a known range — shelf space, quota,
	score. Progress reports how far along a task is. They look alike and mean
	different things, so they are announced differently.
-->
<div
	role="meter"
	aria-label={label}
	aria-valuenow={meter.value}
	aria-valuemin={min}
	aria-valuemax={max}
	data-slot="meter"
	class={cn('flex w-full flex-col gap-1.5', className)}
	{...rest}
>
	{@render children?.()}
</div>
