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
	data-slot="empty-content"
	class={cn('flex w-full max-w-sm flex-col items-center gap-4 text-sm text-balance', className)}
	{...rest}
>
	{@render children?.()}
</div>
