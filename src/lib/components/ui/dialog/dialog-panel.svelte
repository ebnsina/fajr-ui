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

<ScrollArea class="min-h-0 flex-1" overscrollContain scrollFade>
	<div
		data-slot="dialog-panel"
		class={cn(
			'p-6 in-[[data-slot=dialog]:has([data-slot=dialog-footer])]:pb-6 in-[[data-slot=dialog]:has([data-slot=dialog-header])]:pt-1',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
</ScrollArea>
