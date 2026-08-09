<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import ScrollArea from '../scroll-area.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
</script>

<ScrollArea class="min-h-0 flex-1" fill overscrollContain scrollFade>
	<div
		data-sidebar="content"
		data-slot="sidebar-content"
		class={cn(
			'flex h-full flex-col gap-2 group-data-[collapsible=icon]:overflow-hidden',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
</ScrollArea>
