<script module lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SidebarMenuSubButtonProps = HTMLAnchorAttributes & {
		size?: 'sm' | 'md';
		isActive?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		size = 'md',
		isActive = false,
		children,
		...rest
	}: SidebarMenuSubButtonProps = $props();
</script>

<a
	data-active={isActive}
	data-sidebar="menu-sub-button"
	data-size={size}
	data-slot="sidebar-menu-sub-button"
	aria-current={isActive ? 'page' : undefined}
	class={cn(
		"flex h-8 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-lg px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:h-7 [&>span:last-child]:truncate [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground [&>svg:not([class*='size-'])]:size-4",
		'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
		size === 'sm' && 'text-xs',
		size === 'md' && 'text-sm',
		'group-data-[collapsible=icon]:hidden',
		className
	)}
	{...rest}
>
	{@render children?.()}
</a>
