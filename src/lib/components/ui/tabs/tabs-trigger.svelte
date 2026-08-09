<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type TabsTriggerProps = Omit<HTMLButtonAttributes, 'value'> & {
		value: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useTabs } from './context.svelte';
	import { horizontalSign } from '$lib/internal/rtl';

	let { class: className, value, children, onclick, ...rest }: TabsTriggerProps = $props();

	const tabs = useTabs();
	const selected = $derived(tabs.value === value);

	$effect(() => tabs.register(value));

	function onkeydown(event: KeyboardEvent) {
		// Arrows follow the tablist's own axis: Left/Right across a row, Up/Down
		// down a column. Pressing the cross-axis key should do nothing rather than
		// move an invisible cursor.
		const vertical = tabs.orientation === 'vertical';
		const forward = vertical ? 'ArrowDown' : 'ArrowRight';
		const back = vertical ? 'ArrowUp' : 'ArrowLeft';
		// Horizontally, the keys follow what the reader sees, so they swap in a
		// right-to-left row. Vertical axes mean the same thing either way.
		const step = vertical ? 1 : horizontalSign(event.currentTarget as Element);

		let next: string | undefined;
		if (event.key === forward) next = tabs.move(value, step);
		else if (event.key === back) next = tabs.move(value, -step);
		else if (event.key === 'Home') next = tabs.first();
		else if (event.key === 'End') next = tabs.last();
		else return;

		if (!next) return;
		event.preventDefault();
		tabs.select(next);
		// Selection follows focus, so the newly selected tab must take focus too.
		document.getElementById(tabs.tabId(next))?.focus();
	}
</script>

<!--
	`aria-controls` only while selected. Inactive panels are unmounted, so every
	other tab was pointing at an id that did not exist — a dangling reference that
	"jump to controlled element" cannot follow.
-->
<button
	type="button"
	role="tab"
	id={tabs.tabId(value)}
	aria-selected={selected}
	aria-controls={selected ? tabs.panelId(value) : undefined}
	tabindex={selected ? 0 : -1}
	data-slot="tabs-trigger"
	data-state={selected ? 'active' : 'inactive'}
	data-orientation={tabs.orientation}
	onclick={(event) => {
		onclick?.(event);
		tabs.select(value);
	}}
	{onkeydown}
	class={cn(
		// The active fill lives on the sliding indicator, not on the tab itself.
		"relative flex h-9 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-[calc(--spacing(2.5)-1px)] text-base font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] duration-(--duration-press) ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-[state=active]:text-foreground sm:h-8 sm:text-sm pointer-coarse:after:absolute pointer-coarse:after:top-1/2 pointer-coarse:after:left-1/2 pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 pointer-coarse:after:-translate-x-1/2 pointer-coarse:after:-translate-y-1/2 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
