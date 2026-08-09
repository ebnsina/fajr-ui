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

<li data-slot="breadcrumb-item" class={cn('inline-flex items-center gap-1.5', className)} {...rest}>
	{@render children?.()}
</li>
