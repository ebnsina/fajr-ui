<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SidebarProps = HTMLAttributes<HTMLDivElement> & {
		side?: 'left' | 'right';
		variant?: 'sidebar' | 'floating' | 'inset';
		collapsible?: 'offcanvas' | 'icon' | 'none';
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Sheet, SheetPopup } from '../sheet';
	import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './context.svelte';

	let {
		class: className,
		side = 'left',
		variant = 'sidebar',
		collapsible = 'offcanvas',
		children,
		...rest
	}: SidebarProps = $props();

	const sidebar = useSidebar();
	const isFloating = $derived(variant === 'floating' || variant === 'inset');
</script>

{#if collapsible === 'none'}
	<div
		data-slot="sidebar"
		class={cn(
			'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
{:else if sidebar.isMobile}
	<Sheet bind:open={sidebar.openMobile} {side}>
		<SheetPopup
			title="Sidebar"
			data-mobile="true"
			data-sidebar="sidebar"
			data-slot="sidebar"
			style="width: {SIDEBAR_WIDTH_MOBILE}"
			class="bg-sidebar p-0 text-sidebar-foreground"
		>
			<div class="flex h-full w-full flex-col">
				{@render children?.()}
			</div>
		</SheetPopup>
	</Sheet>
{:else}
	<!--
		An `aside`, not a `div`. Everything in here — the product mark, the nav, the
		account row — sat outside every landmark, so a screen reader user jumping
		by landmark could not reach the sidebar at all and anything in it was
		announced as loose content. The label is what makes it addressable; pass
		`aria-label` to override it.
	-->
	<aside
		aria-label="Sidebar"
		class="group peer hidden text-sidebar-foreground md:block"
		data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
		data-side={side}
		data-slot="sidebar"
		data-state={sidebar.state}
		data-variant={variant}
	>
		<!-- Handles the sidebar gap on desktop -->
		<div
			data-slot="sidebar-gap"
			class={cn(
				'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
				'group-data-[collapsible=offcanvas]:w-0',
				'group-data-[side=right]:rotate-180',
				isFloating
					? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
					: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
			)}
		></div>
		<div
			inert={sidebar.state === 'collapsed' && collapsible === 'offcanvas'}
			data-slot="sidebar-container"
			class={cn(
				'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
				side === 'left'
					? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
					: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
				isFloating
					? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
					: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
				className
			)}
			{...rest}
		>
			<div
				data-sidebar="sidebar"
				data-slot="sidebar-inner"
				class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm/5"
			>
				{@render children?.()}
			</div>
		</div>
	</aside>
{/if}
