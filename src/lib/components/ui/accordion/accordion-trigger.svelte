<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type AccordionTriggerProps = HTMLButtonAttributes & {
		/** Heading level the trigger sits inside, for document outline correctness. */
		level?: 2 | 3 | 4 | 5 | 6;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useAccordion, useAccordionItem } from './context.svelte';

	let {
		class: className,
		level = 3,
		onclick,
		onkeydown,
		children,
		...rest
	}: AccordionTriggerProps = $props();

	const accordion = useAccordion();
	const item = useAccordionItem();
	const open = $derived(accordion.isOpen(item.value));

	function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLButtonElement }) {
		onkeydown?.(event);
		if (event.defaultPrevented) return;

		const move = { ArrowDown: 1, ArrowUp: -1, Home: 'first', End: 'last' }[event.key];
		if (move === undefined) return;
		event.preventDefault();
		accordion.move(event.currentTarget, move as number | 'first' | 'last');
	}
</script>

<!--
	The button is wrapped in a real heading so the accordion appears in the
	document outline and can be navigated by heading, which is how screen reader
	users move through a page of collapsed sections.
-->
<svelte:element this={`h${level}`} class="flex">
	<button
		type="button"
		id={accordion.triggerId(item.value)}
		aria-expanded={open}
		aria-controls={accordion.contentId(item.value)}
		disabled={item.disabled() || undefined}
		data-slot="accordion-trigger"
		data-state={open ? 'open' : 'closed'}
		onclick={(event) => {
			onclick?.(event);
			if (!event.defaultPrevented) accordion.toggle(item.value);
		}}
		onkeydown={handleKeydown}
		class={cn(
			'flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-lg py-4 text-start text-base font-medium transition-colors outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm',
			className
		)}
		{...rest}
	>
		{@render children?.()}
		<svg
			aria-hidden="true"
			class="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground opacity-80 transition-transform duration-(--duration-drawer) ease-out motion-reduce:transition-none"
			class:rotate-180={open}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</button>
</svelte:element>
