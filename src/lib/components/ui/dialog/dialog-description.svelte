<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useDialog } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();

	const dialog = useDialog();

	$effect(() => dialog.registerDescription(dialog.descriptionId));
</script>

<p
	id={dialog.descriptionId}
	data-slot="dialog-description"
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
