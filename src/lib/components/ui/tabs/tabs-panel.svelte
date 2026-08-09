<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
		value: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useTabs } from './context.svelte';

	let { class: className, value, children, ...rest }: TabsPanelProps = $props();

	const tabs = useTabs();
	const selected = $derived(tabs.value === value);
</script>

{#if selected}
	<div
		role="tabpanel"
		id={tabs.panelId(value)}
		aria-labelledby={tabs.tabId(value)}
		tabindex={0}
		data-slot="tabs-panel"
		class={cn(
			'flex-1 animate-fade-in outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:animate-none',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
