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
	Sits in its own trailing column and spans both rows on wider screens; on
	mobile it drops below the text instead of squeezing it.
-->
<div
	data-slot="alert-action"
	class={cn(
		'flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
