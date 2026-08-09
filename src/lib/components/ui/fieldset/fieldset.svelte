<script lang="ts">
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { setFieldsetContext } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLFieldsetAttributes & { children?: Snippet } = $props();

	const legendId = $props.id();
	const descriptionId = `${legendId}-description`;

	// The description names nothing until it exists, so track it rather than
	// always pointing at an id that may never be rendered.
	let described = $state(false);

	setFieldsetContext({
		legendId,
		descriptionId,
		hasDescription: () => described,
		registerDescription: () => (described = true)
	});
</script>

<!--
	A real fieldset: disabling it disables every control inside. The group is
	named by the legend through `aria-labelledby` rather than by a `<legend>`
	element, because a `<legend>` child is rendered as the fieldset's caption box
	and sits outside normal flow — so `gap` never applies to it and it overlaps
	whatever follows.
-->
<fieldset
	aria-labelledby={legendId}
	aria-describedby={described ? descriptionId : undefined}
	data-slot="fieldset"
	class={cn('flex min-w-0 flex-col gap-4 disabled:opacity-64', className)}
	{...rest}
>
	{@render children?.()}
</fieldset>
