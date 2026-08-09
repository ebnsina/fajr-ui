<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useCollapsible } from './context.svelte';

	let {
		class: className,
		onclick,
		children,
		...rest
	}: HTMLButtonAttributes & { children?: Snippet } = $props();

	const collapsible = useCollapsible();
</script>

<button
	type="button"
	id={collapsible.triggerId}
	aria-expanded={collapsible.open}
	aria-controls={collapsible.contentId}
	disabled={collapsible.disabled || undefined}
	data-slot="collapsible-trigger"
	data-state={collapsible.open ? 'open' : 'closed'}
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) collapsible.toggle();
	}}
	class={cn(
		'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
