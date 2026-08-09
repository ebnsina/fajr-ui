<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLOListElement> & { children?: Snippet } = $props();
</script>

<ol
	data-slot="breadcrumb-list"
	class={cn(
		'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5',
		className
	)}
	{...rest}
>
	{@render children?.()}
</ol>
