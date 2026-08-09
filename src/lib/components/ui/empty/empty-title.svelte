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

<p data-slot="empty-title" class={cn('font-heading text-xl font-semibold', className)} {...rest}>
	{@render children?.()}
</p>
