<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { TabsOrientation } from './context.svelte';

	export type TabsProps = HTMLAttributes<HTMLDivElement> & {
		value?: string;
		orientation?: TabsOrientation;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { TabsState, setTabsContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		value = $bindable(''),
		orientation = 'horizontal',
		children,
		...rest
	}: TabsProps = $props();

	setTabsContext(
		new TabsState({
			baseId,
			value: () => value,
			setValue: (next) => (value = next),
			orientation: () => orientation
		})
	);
</script>

<div
	data-slot="tabs"
	data-orientation={orientation}
	class={cn('flex gap-2', orientation === 'vertical' ? 'flex-row' : 'flex-col', className)}
	{...rest}
>
	{@render children?.()}
</div>
