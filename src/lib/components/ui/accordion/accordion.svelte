<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { AccordionType } from './context.svelte';

	export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
		type?: AccordionType;
		/** A string in single mode, an array in multiple mode. */
		value?: string | string[];
		/** Single mode only: whether the open panel can be closed again. */
		collapsible?: boolean;
		disabled?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { AccordionState, setAccordionContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		type = 'single',
		value = $bindable(),
		collapsible = true,
		disabled = false,
		children,
		...rest
	}: AccordionProps = $props();

	let root = $state<HTMLElement | null>(null);

	setAccordionContext(
		new AccordionState({
			baseId,
			root: () => root,
			type: () => type,
			value: () => value,
			setValue: (next) => (value = next as string | string[] | undefined),
			collapsible: () => collapsible,
			disabled: () => disabled
		})
	);
</script>

<div
	bind:this={root}
	data-slot="accordion"
	data-type={type}
	class={cn('flex w-full flex-col', className)}
	{...rest}
>
	{@render children?.()}
</div>
