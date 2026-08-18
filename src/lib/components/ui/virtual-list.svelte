<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type VirtualListProps<T> = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		items: T[];
		/** Row height in pixels. Every row must be exactly this tall. */
		itemHeight: number;
		/** Viewport height. Give a number for pixels, or a CSS length. */
		height?: number | string;
		/**
		 * Rows rendered beyond each edge. A few absorb the gap between a scroll
		 * event and the next paint; more than a few is just work.
		 */
		overscan?: number;
		/**
		 * Accessible name for the scrolling region. Required: the region is a tab
		 * stop, and an unnamed one tells a screen-reader user nothing about what
		 * they have just landed in.
		 */
		label: string;
		children: Snippet<[T, number]>;
	};
</script>

<script lang="ts" generics="T">
	import { cn } from '$lib/utils';

	let {
		class: className,
		items,
		itemHeight,
		height = 320,
		overscan = 6,
		label,
		children,
		...rest
	}: VirtualListProps<T> = $props();

	let scrollTop = $state(0);
	let viewport = $state(0);

	const total = $derived(items.length * itemHeight);

	/*
	 * The window of rows worth having in the DOM. Only these are rendered; the
	 * rest exist as height on a single spacer, so a hundred thousand rows cost
	 * the same as thirty.
	 */
	const first = $derived(Math.max(0, Math.floor(scrollTop / itemHeight) - overscan));
	const last = $derived(
		Math.min(items.length, Math.ceil((scrollTop + viewport) / itemHeight) + overscan)
	);
	const visible = $derived(items.slice(first, last));

	function onscroll(event: Event) {
		// Read straight from the event rather than binding: `bind:scrollTop` writes
		// back, and a write during a scroll fights the browser's own scrolling.
		scrollTop = (event.currentTarget as HTMLElement).scrollTop;
	}
</script>

<!--
	`aria-setsize` and `aria-posinset` on every row, because the DOM only ever
	holds a slice: without them a screen reader announces "3 of 30" in a list of
	thirty thousand. They are the ARIA mechanism for exactly this — a list whose
	rendered items are a window onto a longer set.

	A single translated container rather than one absolute row each: one transform
	per frame instead of `n`, and rows keep their document order for selection and
	copy.
-->
<!--
	A scrollable region must be reachable by keyboard, or its content is
	unreachable without a pointer (WCAG 2.1.1). `tabindex="0"` on a labelled
	region is the pattern WAI recommends for exactly this; the rule cannot tell
	a scroll container from a static one.

	The directive below is on its own, with nothing after the rule name: Svelte
	reads every whitespace-separated word that follows as another rule code, so
	an explanation written inside it becomes a list of rules that do not exist.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!--
	`group`, not `region`. A region is a landmark, and these appear many times on
	one page — every props table on a docs page is a scroll container named
	"Table". That fills the landmark list with identical entries, which is what
	`landmark-unique` reports and what makes landmark navigation useless. The
	role still carries the accessible name, and `tabindex` still makes the
	overflow reachable from the keyboard, which is the reason it is labelled.

	Accordion and Collapsible keep `region`: each is named by its own trigger, so
	they are genuinely distinct sections rather than repeats of one control.
-->
<div
	data-slot="virtual-list"
	role="group"
	aria-label={label}
	tabindex="0"
	{onscroll}
	bind:clientHeight={viewport}
	style:height={typeof height === 'number' ? `${height}px` : height}
	class={cn(
		'relative overflow-y-auto overscroll-contain rounded-lg border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring',
		className
	)}
	{...rest}
>
	<!-- The scrollbar reflects every row, not the rendered few. -->
	<div style:height="{total}px" class="relative w-full">
		<div
			role="list"
			style:transform="translateY({first * itemHeight}px)"
			class="absolute inset-x-0 top-0"
		>
			{#each visible as item, index (first + index)}
				<div
					role="listitem"
					aria-setsize={items.length}
					aria-posinset={first + index + 1}
					style:height="{itemHeight}px"
					class="flex items-center"
				>
					{@render children(item, first + index)}
				</div>
			{/each}
		</div>
	</div>
</div>
