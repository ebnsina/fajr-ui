<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useFieldset } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	const fieldset = useFieldset();
</script>

<div
	id={fieldset?.legendId}
	data-slot="fieldset-legend"
	class={cn('text-base font-medium sm:text-sm', className)}
	{...rest}
>
	{@render children?.()}
</div>
