<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
		value: string;
		disabled?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { cn } from '$lib/utils';
	import { setAccordionItemContext, useAccordion } from './context.svelte';

	let {
		class: className,
		value,
		disabled = false,
		children,
		...rest
	}: AccordionItemProps = $props();

	const accordion = useAccordion();
	// `value` identifies the item and does not change once mounted; `disabled`
	// is read through a getter so it stays live.
	setAccordionItemContext({
		value: untrack(() => value),
		disabled: () => disabled || accordion.disabled
	});
</script>

<div
	data-slot="accordion-item"
	data-state={accordion.isOpen(value) ? 'open' : 'closed'}
	class={cn('border-b last:border-b-0', className)}
	{...rest}
>
	{@render children?.()}
</div>
