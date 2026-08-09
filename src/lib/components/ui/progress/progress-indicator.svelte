<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type ProgressIndicatorProps = HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useProgress } from './context.svelte';

	let { class: className, ...rest }: ProgressIndicatorProps = $props();

	const progress = useProgress();
</script>

<!--
	A transition rather than a keyframe: progress updates arrive at unpredictable
	times, and a transition retargets from wherever the bar currently is.
-->
<div
	data-slot="progress-indicator"
	class={cn(
		'h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none',
		progress.indeterminate &&
			'w-2/5 animate-progress-indeterminate motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-64',
		className
	)}
	style={progress.indeterminate ? undefined : `width: ${progress.percent}%`}
	{...rest}
></div>
