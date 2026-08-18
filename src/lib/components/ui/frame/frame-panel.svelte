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
	data-slot="frame-panel"
	class={cn('relative rounded-xl border bg-background bg-clip-padding p-5', className)}
	{...rest}
>
	{@render children?.()}
</div>
