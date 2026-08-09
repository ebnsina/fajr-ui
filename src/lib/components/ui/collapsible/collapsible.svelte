<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CollapsibleProps = HTMLAttributes<HTMLDivElement> & {
		open?: boolean;
		disabled?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { CollapsibleState, setCollapsibleContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		open = $bindable(false),
		disabled = false,
		children,
		...rest
	}: CollapsibleProps = $props();

	setCollapsibleContext(
		new CollapsibleState({
			baseId,
			open: () => open,
			disabled: () => disabled,
			toggle: () => (open = !open)
		})
	);
</script>

<div data-slot="collapsible" data-state={open ? 'open' : 'closed'} class={cn(className)} {...rest}>
	{@render children?.()}
</div>
