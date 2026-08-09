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
	data-slot="dialog-header"
	class={cn(
		'flex flex-col gap-2 p-6 in-[[data-slot=dialog]:has([data-slot=dialog-panel])]:pb-3 max-sm:pb-4',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
