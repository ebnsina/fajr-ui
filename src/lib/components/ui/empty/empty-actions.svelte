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
	data-slot="empty-actions"
	class={cn('mt-1 flex flex-wrap items-center justify-center gap-2', className)}
	{...rest}
>
	{@render children?.()}
</div>
