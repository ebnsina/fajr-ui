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

<caption
	data-slot="table-caption"
	class={cn('mt-4 text-sm text-muted-foreground in-data-[variant=card]:my-4', className)}
	{...rest}
>
	{@render children?.()}
</caption>
