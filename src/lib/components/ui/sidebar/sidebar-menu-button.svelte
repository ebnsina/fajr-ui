<script module lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export const sidebarMenuButtonVariants = cva(
		"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-start text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pe-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0",
		{
			defaultVariants: {
				size: 'default',
				variant: 'default'
			},
			variants: {
				size: {
					default: 'h-8 text-sm',
					lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
					sm: 'h-7 text-xs'
				},
				variant: {
					default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
					outline:
						'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
				}
			}
		}
	);

	export type SidebarMenuButtonProps = HTMLButtonAttributes &
		Omit<HTMLAnchorAttributes, keyof HTMLButtonAttributes> & {
			isActive?: boolean;
			variant?: NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['variant']>;
			size?: NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['size']>;
			/** Renders an `<a>` instead of a `<button>`. */
			href?: string;
			/** Shown on hover/focus only while the sidebar is collapsed to icons. */
			tooltip?: string;
			children?: Snippet;
		};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { tooltip as tooltipAction } from '$lib/actions/tooltip';
	import { useSidebar } from './context.svelte';

	let {
		class: className,
		isActive = false,
		variant = 'default',
		size = 'default',
		href,
		type = 'button',
		tooltip,
		children,
		...rest
	}: SidebarMenuButtonProps = $props();

	const classes = $derived(cn(sidebarMenuButtonVariants({ size, variant }), className));
	const anchorRest = $derived(rest as HTMLAnchorAttributes);

	const sidebar = useSidebar();
	// The label is visible when expanded, so a tooltip would only repeat it.
	const tip = $derived({
		content: tooltip,
		side: 'right' as const,
		disabled: sidebar.state !== 'collapsed' || sidebar.isMobile
	});
</script>

{#if href !== undefined}
	<a
		{href}
		data-active={isActive}
		data-sidebar="menu-button"
		data-size={size}
		data-slot="sidebar-menu-button"
		aria-current={isActive ? 'page' : undefined}
		class={classes}
		use:tooltipAction={tip}
		{...anchorRest}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		data-active={isActive}
		data-sidebar="menu-button"
		data-size={size}
		data-slot="sidebar-menu-button"
		class={classes}
		use:tooltipAction={tip}
		{...rest}
	>
		{@render children?.()}
	</button>
{/if}
