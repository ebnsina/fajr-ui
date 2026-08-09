<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SidebarMenuActionProps = HTMLButtonAttributes & {
		showOnHover?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		showOnHover = false,
		type = 'button',
		children,
		...rest
	}: SidebarMenuActionProps = $props();
</script>

<button
	{type}
	data-sidebar="menu-action"
	data-slot="sidebar-menu-action"
	class={cn(
		"absolute end-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-lg p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
		// Increases the hit area of the button on mobile.
		'after:absolute after:-inset-2 md:after:hidden',
		'peer-data-[size=sm]/menu-button:top-1',
		'peer-data-[size=default]/menu-button:top-1.5',
		'peer-data-[size=lg]/menu-button:top-2.5',
		'group-data-[collapsible=icon]:hidden',
		showOnHover &&
			'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
