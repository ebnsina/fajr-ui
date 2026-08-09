<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useSelectGroupLabelId } from './group-context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	// Names the surrounding group, when there is one.
	const labelId = useSelectGroupLabelId();
</script>

<div
	id={labelId}
	data-slot="select-label"
	class={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</div>
