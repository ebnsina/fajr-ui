<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { SheetSide, SheetVariant } from './context.svelte';

	export type SheetProps = {
		open?: boolean;
		/** Which edge the sheet slides in from. */
		side?: SheetSide;
		/** `inset` floats the panel with a margin instead of meeting the edges. */
		variant?: SheetVariant;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { SheetState, setSheetContext } from './context.svelte';

	const baseId = $props.id();

	let {
		open = $bindable(false),
		side = 'right',
		variant = 'default',
		children
	}: SheetProps = $props();

	setSheetContext(
		new SheetState({
			open: () => open,
			setOpen: (next) => (open = next),
			side: () => side,
			variant: () => variant,
			titleId: `${baseId}-title`,
			descriptionId: `${baseId}-description`
		})
	);
</script>

<!--
	The root renders nothing itself: it holds the state so a trigger can sit
	anywhere in the tree relative to the panel it opens.
-->
{@render children?.()}
