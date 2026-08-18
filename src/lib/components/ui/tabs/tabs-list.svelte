<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { TabsVariant } from './context.svelte';

	export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
		/** `underline` swaps the sliding pill for a rule along the active edge. */
		variant?: TabsVariant;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useTabs } from './context.svelte';

	let { class: className, variant = 'default', children, ...rest }: TabsListProps = $props();

	const tabs = useTabs();
	const vertical = $derived(tabs.orientation === 'vertical');

	let list = $state<HTMLElement | null>(null);
	let rect = $state<{ left: number; top: number; width: number; height: number } | null>(null);

	/**
	 * The indicator is measured from the active tab rather than driven by an
	 * index, so it stays correct when tabs are added, hidden, or reflow onto a
	 * new line — none of which an index-based offset would notice.
	 */
	function measure() {
		if (!list) return;
		const active = list.querySelector<HTMLElement>(
			'[data-slot="tabs-trigger"][data-state="active"]'
		);
		if (!active) {
			rect = null;
			return;
		}
		rect = {
			left: active.offsetLeft,
			top: active.offsetTop,
			width: active.offsetWidth,
			height: active.offsetHeight
		};
	}

	// Computed here rather than in classes: an inline `translate` beats Tailwind's
	// `translate-*` utilities, so mixing the two silently drops the offset.
	const indicatorTranslate = $derived(
		variant === 'underline'
			? vertical
				? 'calc(var(--tab-left) - 1px) var(--tab-top)'
				: 'var(--tab-left) calc(var(--tab-top) + var(--tab-height) - 2px)'
			: 'var(--tab-left) var(--tab-top)'
	);

	$effect(() => {
		// Re-measure when the selection changes, and whenever anything resizes.
		void tabs.value;
		void tabs.orientation;
		if (!list) return;
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(list);
		for (const child of list.children) observer.observe(child);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={list}
	role="tablist"
	aria-orientation={tabs.orientation}
	data-slot="tabs-list"
	data-variant={variant}
	style={rect
		? `--tab-left: ${rect.left}px; --tab-top: ${rect.top}px; --tab-width: ${rect.width}px; --tab-height: ${rect.height}px`
		: undefined}
	class={cn(
		'relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-muted-foreground',
		vertical && 'w-full flex-col items-stretch',
		variant === 'default'
			? 'rounded-lg bg-muted p-0.5'
			: 'gap-x-1 *:data-[slot=tabs-trigger]:hover:bg-accent',
		variant === 'underline' && (vertical ? 'px-1' : 'py-1'),
		className
	)}
	{...rest}
>
	{@render children?.()}

	{#if rect}
		<!--
			One element that slides, rather than a background on each tab: the
			movement is what tells you where the selection went.
		-->
		<span
			aria-hidden="true"
			data-slot="tabs-indicator"
			style="translate: {indicatorTranslate};"
			class={cn(
				'pointer-events-none absolute top-0 left-0 transition-[translate,width,height] duration-200 ease-in-out motion-reduce:transition-none',
				variant === 'default' &&
					'-z-1 h-(--tab-height) w-(--tab-width) rounded-lg bg-background shadow-sm/5 dark:bg-input',
				variant === 'underline' && 'z-10 bg-primary',
				variant === 'underline' && (vertical ? 'h-(--tab-height) w-0.5' : 'h-0.5 w-(--tab-width)')
			)}
		></span>
	{/if}
</div>
