<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useField } from './context.svelte';

	let {
		class: className,
		for: forProp,
		children,
		...rest
	}: HTMLLabelAttributes & { children?: Snippet } = $props();

	const field = useField();
</script>

<label
	for={forProp ?? field?.controlId}
	data-slot="field-label"
	data-disabled={field?.disabled ? '' : undefined}
	class={cn(
		'inline-flex items-center gap-2 text-base/4.5 font-medium text-foreground data-disabled:opacity-64 sm:text-sm/4',
		className
	)}
	{...rest}
>
	{@render children?.()}
</label>
