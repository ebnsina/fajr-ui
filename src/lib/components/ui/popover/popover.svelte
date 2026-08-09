<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type PopoverProps = {
		open?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { PopoverState, setPopoverContext } from './context.svelte';

	const baseId = $props.id();

	let { open = $bindable(false), children }: PopoverProps = $props();

	setPopoverContext(
		new PopoverState({
			open: () => open,
			setOpen: (next) => (open = next),
			titleId: `${baseId}-title`,
			descriptionId: `${baseId}-description`
		})
	);
</script>

<!--
	The root renders nothing: it holds the open state and the anchor the trigger
	registers, so the panel can be written next to the trigger without threading a
	ref between them by hand.
-->
{@render children?.()}
