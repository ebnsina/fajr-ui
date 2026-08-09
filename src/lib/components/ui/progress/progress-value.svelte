<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ProgressValueProps = HTMLAttributes<HTMLSpanElement> & {
		/** Formats the readout; the default is a whole-number percentage. */
		format?: (value: number | null, max: number) => string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useProgress } from './context.svelte';

	let { class: className, format, children, ...rest }: ProgressValueProps = $props();

	const progress = useProgress();
	const text = $derived(
		format
			? format(progress.value, progress.max)
			: progress.indeterminate
				? ''
				: `${Math.round(progress.percent)}%`
	);
</script>

<span data-slot="progress-value" class={cn('text-sm tabular-nums', className)} {...rest}>
	{#if children}{@render children()}{:else}{text}{/if}
</span>
