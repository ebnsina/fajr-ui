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
	data-slot="dialog-footer"
	class={cn(
		'flex flex-col-reverse gap-2 bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
