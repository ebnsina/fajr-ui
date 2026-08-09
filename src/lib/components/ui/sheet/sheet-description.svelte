<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useSheet } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();

	const sheet = useSheet();

	$effect(() => sheet.registerDescription(sheet.descriptionId));
</script>

<p
	id={sheet.descriptionId}
	data-slot="sheet-description"
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
