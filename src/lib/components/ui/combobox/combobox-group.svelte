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

<!-- A group with nothing left after filtering hides itself, label and all. -->
<div
	data-slot="combobox-group"
	class={cn('flex flex-col gap-0.5 not-has-[[role=option]]:hidden', className)}
	{...rest}
>
	{@render children?.()}
</div>
