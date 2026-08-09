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
	data-slot="card-footer"
	class={cn(
		'flex items-center p-6 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-4',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
