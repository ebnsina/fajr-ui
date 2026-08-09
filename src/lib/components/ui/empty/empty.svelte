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
	data-slot="empty"
	class={cn(
		'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center text-balance md:py-20',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
