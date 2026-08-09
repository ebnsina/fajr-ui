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

<div
	data-slot="card-action"
	class={cn(
		'col-start-2 row-span-2 row-start-1 inline-flex self-start justify-self-end',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
