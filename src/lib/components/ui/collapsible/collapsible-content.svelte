<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useCollapsible } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	const collapsible = useCollapsible();
</script>

<!--
	Animating to the content's natural height without measuring it: the grid row
	goes from `0fr` to `1fr`, which is interpolatable where `height: auto` is not.
	No ResizeObserver, and it stays correct when the content reflows.

	`inert` while closed keeps the hidden content out of the tab order and the
	accessibility tree — `overflow: hidden` alone hides it visually but leaves it
	reachable, which is how collapsed panels end up as keyboard traps.
-->
<div
	id={collapsible.contentId}
	role="region"
	aria-labelledby={collapsible.triggerId}
	inert={!collapsible.open}
	data-slot="collapsible-content"
	data-state={collapsible.open ? 'open' : 'closed'}
	class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-drawer) ease-out data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
>
	<div class="overflow-hidden">
		<div class={cn(className)} {...rest}>
			{@render children?.()}
		</div>
	</div>
</div>
