<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useFieldset } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();

	// Registering is what makes this the group's description rather than loose
	// text a screen-reader user only meets by browsing the page.
	const fieldset = useFieldset();

	$effect(() => fieldset?.registerDescription());
</script>

<p
	id={fieldset?.descriptionId}
	data-slot="fieldset-description"
	class={cn('-mt-2 text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
