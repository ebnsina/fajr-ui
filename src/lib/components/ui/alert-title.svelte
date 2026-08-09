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
	data-slot="alert-title"
	class={cn('col-start-2 min-h-4 font-medium tracking-tight', className)}
	{...rest}
>
	{@render children?.()}
</div>
