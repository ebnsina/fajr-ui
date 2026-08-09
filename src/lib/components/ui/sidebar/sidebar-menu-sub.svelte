<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLUListElement> & { children?: Snippet } = $props();
</script>

<ul
	data-sidebar="menu-sub"
	data-slot="sidebar-menu-sub"
	class={cn(
		'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5',
		'group-data-[collapsible=icon]:hidden',
		className
	)}
	{...rest}
>
	{@render children?.()}
</ul>
