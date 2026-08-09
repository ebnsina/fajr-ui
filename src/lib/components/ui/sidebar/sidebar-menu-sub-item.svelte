<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLLIElement> & { children?: Snippet } = $props();
</script>

<li
	data-sidebar="menu-sub-item"
	data-slot="sidebar-menu-sub-item"
	class={cn('group/menu-sub-item relative', className)}
	{...rest}
>
	{@render children?.()}
</li>
