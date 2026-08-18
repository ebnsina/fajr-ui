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
	data-slot="card"
	class={cn(
		'relative flex flex-col rounded-2xl border bg-card text-card-foreground not-dark:bg-clip-padding',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
