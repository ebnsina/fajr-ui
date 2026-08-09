<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { SidebarGroupState, setSidebarGroupContext } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	const uid = $props.id();
	const group = setSidebarGroupContext(new SidebarGroupState(`${uid}-label`));
</script>

<!--
	A named group, so the navigation reads as sections rather than as one long
	run of links. `role="group"` only appears alongside a label: an anonymous
	group announces its boundaries and nothing about what they separate, which
	costs a screen reader user two announcements per section for no information.
-->
<div
	data-sidebar="group"
	data-slot="sidebar-group"
	role={group.labelled ? 'group' : undefined}
	aria-labelledby={group.labelled ? group.labelId : undefined}
	class={cn('relative flex w-full min-w-0 flex-col p-2', className)}
	{...rest}
>
	{@render children?.()}
</div>
