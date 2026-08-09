<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		type = 'button',
		children,
		...rest
	}: HTMLButtonAttributes & { children?: Snippet } = $props();
</script>

<button
	{type}
	data-sidebar="group-action"
	data-slot="sidebar-group-action"
	class={cn(
		"absolute end-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-lg p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
		// Increases the hit area of the button on mobile.
		'after:absolute after:-inset-2 md:after:hidden',
		'group-data-[collapsible=icon]:hidden',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
