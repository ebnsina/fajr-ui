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
	data-slot="empty-header"
	class={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
	{...rest}
>
	{@render children?.()}
</div>
