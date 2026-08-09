<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useSheet } from '../sheet/context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();

	// A Drawer is a Sheet underneath, so it registers the same way SheetTitle
	// does. Without this the heading was visible but never became the dialog's
	// accessible name, and a Drawer composed from its parts announced itself as
	// the fallback "Drawer".
	const sheet = useSheet();

	$effect(() => sheet.registerTitle(sheet.titleId));
</script>

<h2
	id={sheet.titleId}
	data-slot="drawer-title"
	class={cn('font-heading text-lg leading-none font-semibold', className)}
	{...rest}
>
	{@render children?.()}
</h2>
