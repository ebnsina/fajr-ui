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

	// Same as the title: registering is what makes this the dialog's description
	// rather than loose text nobody hears on open.
	const sheet = useSheet();

	$effect(() => sheet.registerDescription(sheet.descriptionId));
</script>

<p
	id={sheet.descriptionId}
	data-slot="drawer-description"
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
