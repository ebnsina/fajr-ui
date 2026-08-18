<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
</script>

<!--
	A tray rather than a card: the muted background shows around and between the
	panels it holds, which is what separates stacked panels without a divider.
-->
<div
	data-slot="frame"
	class={cn(
		'relative flex flex-col rounded-2xl border bg-muted/72 p-1 *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
