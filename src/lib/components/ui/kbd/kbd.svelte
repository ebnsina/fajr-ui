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

<kbd
	data-slot="kbd"
	class={cn(
		"pointer-events-none inline-flex h-5 min-w-5 shrink-0 items-center justify-center gap-1 rounded-xs bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
		className
	)}
	{...rest}
>
	{@render children?.()}
</kbd>
