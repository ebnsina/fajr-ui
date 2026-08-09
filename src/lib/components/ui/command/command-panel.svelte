<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
</script>

<!--
	The results sit on a raised panel rather than directly on the popup, which is
	what separates them from the search row above and the hint bar below. The
	negative inline margin lets its border land on the popup's own edge instead of
	a hair inside it.
-->
<div
	data-slot="command-panel"
	class={cn(
		'relative -mx-px flex min-h-0 flex-col rounded-t-xl border border-b-0 bg-popover bg-clip-padding shadow-xs/5 not-has-[+[data-slot=command-footer]]:-mb-px not-has-[+[data-slot=command-footer]]:rounded-b-2xl',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
