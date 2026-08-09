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
	data-slot="card-panel"
	class={cn(
		'flex-1 p-6 in-[[data-slot=card]:has(>[data-slot=card-footer]:not(.border-t))]:pb-0 in-[[data-slot=card]:has(>[data-slot=card-header]:not(.border-b))]:pt-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
