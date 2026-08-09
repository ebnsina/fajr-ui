<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ProgressLabelProps = HTMLAttributes<HTMLSpanElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useProgress } from './context.svelte';

	let { class: className, children, ...rest }: ProgressLabelProps = $props();

	const progress = useProgress();
</script>

<span
	id={progress.labelId}
	data-slot="progress-label"
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</span>
