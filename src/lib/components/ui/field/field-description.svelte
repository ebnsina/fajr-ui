<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useField } from './context.svelte';

	const generatedId = $props.id();

	let {
		class: className,
		id,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();

	const field = useField();
	const resolvedId = $derived(id ?? generatedId);

	// Registering on mount (and cleaning up on destroy) keeps `aria-describedby`
	// pointing only at descriptions that are actually on the page.
	$effect(() => field?.register(resolvedId));
</script>

<p
	id={resolvedId}
	data-slot="field-description"
	class={cn('text-xs text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
