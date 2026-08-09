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

<div
	data-slot="menu-label"
	class={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</div>
