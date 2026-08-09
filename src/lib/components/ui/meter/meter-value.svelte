<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MeterValueProps = HTMLAttributes<HTMLSpanElement> & {
		/** Formats the readout; the default is a whole-number percentage. */
		format?: (value: number, max: number) => string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useMeter } from './context.svelte';

	let { class: className, format, children, ...rest }: MeterValueProps = $props();

	const meter = useMeter();
	const text = $derived(format ? format(meter.value, meter.max) : `${Math.round(meter.percent)}%`);
</script>

<span data-slot="meter-value" class={cn('text-sm tabular-nums', className)} {...rest}>
	{#if children}{@render children()}{:else}{text}{/if}
</span>
