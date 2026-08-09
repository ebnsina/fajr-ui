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

<header data-slot="frame-panel-header" class={cn('flex flex-col px-5 py-4', className)} {...rest}>
	{@render children?.()}
</header>
