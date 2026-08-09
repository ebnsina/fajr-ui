<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { setSelectGroupLabelId } from './group-context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	const labelId = $props.id();

	setSelectGroupLabelId(labelId);
</script>

<div
	role="group"
	aria-labelledby={labelId}
	data-slot="select-group"
	class={cn('flex flex-col gap-0.5', className)}
	{...rest}
>
	{@render children?.()}
</div>
