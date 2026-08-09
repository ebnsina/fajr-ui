<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useSidebarGroup } from './context.svelte';

	let {
		class: className,
		id,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	const group = useSidebarGroup();

	// Registering from an effect rather than at init: the group reads this flag
	// while rendering the children that set it, and writing to it mid-render is
	// the one thing runes will not allow.
	$effect(() => group?.register());
</script>

<div
	data-sidebar="group-label"
	data-slot="sidebar-group-label"
	id={id ?? group?.labelId}
	class={cn(
		'flex h-8 shrink-0 items-center rounded-lg px-2 text-xs font-medium text-sidebar-foreground ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
		'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
