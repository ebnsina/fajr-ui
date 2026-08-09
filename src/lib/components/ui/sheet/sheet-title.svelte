<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useSheet } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();

	const sheet = useSheet();

	// Registering tells the sheet it now has an accessible name to point at.
	$effect(() => sheet.registerTitle(sheet.titleId));
</script>

<h2
	id={sheet.titleId}
	data-slot="sheet-title"
	class={cn('font-heading text-xl leading-none font-semibold', className)}
	{...rest}
>
	{@render children?.()}
</h2>
