<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useDialog } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();

	const dialog = useDialog();

	// Registering tells the dialog it now has an accessible name to point at.
	$effect(() => dialog.registerTitle(dialog.titleId));
</script>

<h2
	id={dialog.titleId}
	data-slot="dialog-title"
	class={cn('font-heading text-xl leading-none font-semibold', className)}
	{...rest}
>
	{@render children?.()}
</h2>
