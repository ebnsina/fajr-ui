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
	data-sidebar="group-content"
	data-slot="sidebar-group-content"
	class={cn('w-full text-sm', className)}
	{...rest}
>
	{@render children?.()}
</div>
