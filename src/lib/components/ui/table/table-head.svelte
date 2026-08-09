<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		sort,
		children,
		...rest
	}: HTMLThAttributes & {
		/** Announced sort state for this column. */
		sort?: 'ascending' | 'descending' | 'none';
		children?: Snippet;
	} = $props();
</script>

<th
	aria-sort={sort}
	data-slot="table-head"
	class={cn(
		'h-10 px-2.5 text-start align-middle leading-none font-medium whitespace-nowrap text-muted-foreground has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</th>
