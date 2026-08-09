<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type SidebarMenuSkeletonProps = HTMLAttributes<HTMLDivElement> & {
		showIcon?: boolean;
		/** Text width, 50–90% when left unset. */
		width?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Skeleton from '../skeleton.svelte';

	let {
		class: className,
		showIcon = false,
		width = `${Math.floor(Math.random() * 40) + 50}%`,
		...rest
	}: SidebarMenuSkeletonProps = $props();
</script>

<div
	data-sidebar="menu-skeleton"
	data-slot="sidebar-menu-skeleton"
	class={cn('flex h-8 items-center gap-2 rounded-lg px-2', className)}
	{...rest}
>
	{#if showIcon}
		<Skeleton class="size-4 rounded-lg" data-sidebar="menu-skeleton-icon" />
	{/if}
	<Skeleton
		class="h-4 max-w-(--skeleton-width) flex-1"
		data-sidebar="menu-skeleton-text"
		style="--skeleton-width: {width}"
	/>
</div>
