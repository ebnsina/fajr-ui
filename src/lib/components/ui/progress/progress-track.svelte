<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ProgressTrackProps = HTMLAttributes<HTMLDivElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: ProgressTrackProps = $props();
</script>

<div
	data-slot="progress-track"
	class={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
	{...rest}
>
	{@render children?.()}
</div>
