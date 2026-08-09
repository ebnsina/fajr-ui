<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
</script>

<div
	data-slot="empty-media"
	class={cn(
		"relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&>svg:not([class*='size-'])]:size-5",
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
