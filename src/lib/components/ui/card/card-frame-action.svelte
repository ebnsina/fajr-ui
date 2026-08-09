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
	data-slot="card-frame-action"
	class={cn(
		'col-start-2 inline-flex self-center justify-self-end nth-3:row-span-2 nth-3:row-start-1',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
