<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type DataTableToolbarProps = HTMLAttributes<HTMLDivElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: DataTableToolbarProps = $props();
</script>

<div
	data-slot="data-table-toolbar"
	class={cn('flex flex-wrap items-center gap-2', className)}
	{...rest}
>
	{@render children?.()}
</div>
