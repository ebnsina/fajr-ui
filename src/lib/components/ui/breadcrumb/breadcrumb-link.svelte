<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAnchorAttributes & { children?: Snippet } = $props();
</script>

<a
	data-slot="breadcrumb-link"
	class={cn('transition-colors hover:text-foreground', className)}
	{...rest}
>
	{@render children?.()}
</a>
