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

<ul data-slot="pagination-list" class={cn('flex flex-row items-center gap-1', className)} {...rest}>
	{@render children?.()}
</ul>
