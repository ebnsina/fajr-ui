<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: HTMLTdAttributes & { children?: Snippet } = $props();
</script>

<td
	data-slot="table-cell"
	class={cn(
		'p-2.5 align-middle leading-none whitespace-nowrap in-data-[slot=table-footer]:py-3.5 has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</td>
