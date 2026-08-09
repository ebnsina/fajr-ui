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

<!-- The scrolling middle, so the header and footer stay put while it moves. -->
<ScrollArea class="min-h-0 flex-1" overscrollContain scrollFade>
	<div
		data-slot="sheet-panel"
		class={cn(
			'p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer])]:pb-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
</ScrollArea>
