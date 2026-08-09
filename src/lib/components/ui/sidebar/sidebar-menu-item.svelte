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
	data-sidebar="menu-item"
	data-slot="sidebar-menu-item"
	class={cn('group/menu-item relative', className)}
	{...rest}
>
	{@render children?.()}
</li>
