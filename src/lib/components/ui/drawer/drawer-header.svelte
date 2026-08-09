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
	data-slot="drawer-header"
	class={cn(
		'flex flex-col gap-2 px-6 pb-4 in-[[data-slot=drawer]:has([data-slot=drawer-panel])]:pb-3',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
