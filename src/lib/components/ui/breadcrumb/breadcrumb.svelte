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

<!-- A landmark, so the trail can be jumped to directly. -->
<nav aria-label="breadcrumb" data-slot="breadcrumb" class={cn(className)} {...rest}>
	{@render children?.()}
</nav>
