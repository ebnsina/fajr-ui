<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { useAccordion, useAccordionItem } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

	const accordion = useAccordion();
	const item = useAccordionItem();
	const open = $derived(accordion.isOpen(item.value));
</script>

<!--
	Same collapse mechanism as Collapsible: a grid row from 0fr to 1fr animates to
	the natural height without measuring it, and `inert` keeps the closed panel
	out of the tab order rather than merely hiding it.
-->
<div
	id={accordion.contentId(item.value)}
	role="region"
	aria-labelledby={accordion.triggerId(item.value)}
	inert={!open}
	data-slot="accordion-content"
	data-state={open ? 'open' : 'closed'}
	class="grid grid-rows-[0fr] text-sm transition-[grid-template-rows] duration-(--duration-drawer) ease-out data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
>
	<div class="overflow-hidden">
		<div class={cn('pb-4 text-muted-foreground', className)} {...rest}>
			{@render children?.()}
		</div>
	</div>
</div>
