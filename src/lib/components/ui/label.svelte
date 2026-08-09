<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLLabelAttributes & { children?: Snippet } = $props();
</script>

<label
	data-slot="label"
	class={cn(
		'inline-flex items-center gap-2 text-base/4.5 font-medium text-foreground sm:text-sm/4',
		className
	)}
	{...rest}
>
	{@render children?.()}
</label>
