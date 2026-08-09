<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CommandListProps = HTMLAttributes<HTMLDivElement> & {
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import ScrollArea from '../scroll-area.svelte';
	import { useCommand } from './context.svelte';

	let { class: className, label = 'Results', children, ...rest }: CommandListProps = $props();

	const command = useCommand();
	let element = $state<HTMLElement | null>(null);

	$effect(() => {
		command.list = element;
		command.sync();
	});
</script>

<!--
	`group/list` lets the empty state show only when no option survived filtering,
	using `:has()` rather than a count threaded through state.
-->
<!--
	The fade marks which edges still have results behind them. Without it a list
	cut off mid-row looks like the end of the results rather than the top of a
	scroll.
-->
<ScrollArea class="min-h-0 flex-1" overscrollContain scrollFade viewportClass="scroll-py-2">
	<div
		bind:this={element}
		id={command.listId}
		role="listbox"
		aria-label={label}
		data-slot="command-list"
		class={cn('group/list p-2', className)}
		{...rest}
	>
		{@render children?.()}
	</div>
</ScrollArea>
