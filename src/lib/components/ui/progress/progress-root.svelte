<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ProgressRootProps = HTMLAttributes<HTMLDivElement> & {
		/** `null` renders the indeterminate state. */
		value?: number | null;
		max?: number;
		/** Fallback accessible name when no `<ProgressLabel>` is rendered. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ProgressState, setProgressContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		value = 0,
		max = 100,
		label = 'Progress',
		children,
		...rest
	}: ProgressRootProps = $props();

	const progress = setProgressContext(
		new ProgressState({ value: () => value, max: () => max, labelId: `${baseId}-label` })
	);
</script>

<!--
	`role="progressbar"` sits on the root rather than the track, so a label and a
	readout rendered beside the bar are still part of the same announced control.
-->
<div
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={progress.indeterminate ? undefined : (value ?? undefined)}
	data-slot="progress"
	data-state={progress.indeterminate ? 'indeterminate' : 'determinate'}
	class={cn('flex w-full flex-col gap-1.5', className)}
	{...rest}
>
	{@render children?.()}
</div>
