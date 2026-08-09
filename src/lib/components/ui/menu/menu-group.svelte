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

<div role="group" data-slot="menu-group" class={cn('flex flex-col gap-0.5', className)} {...rest}>
	{@render children?.()}
</div>
