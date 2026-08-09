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

<div
	data-slot="drawer-panel"
	class={cn('min-h-0 flex-1 overflow-y-auto px-6', className)}
	{...rest}
>
	{@render children?.()}
</div>
