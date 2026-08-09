<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type PreviewCardPopupProps = {
		side?: Side;
		align?: Align;
		label?: string;
		class?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import PopoverPopup from '../popover/popover-popup.svelte';
	import { usePreviewCard } from './context.svelte';

	let {
		side = 'bottom',
		align = 'center',
		label = 'Preview',
		class: className,
		children
	}: PreviewCardPopupProps = $props();

	const card = usePreviewCard();
</script>

<!--
	`manageFocus` is off: a preview is informational, and stealing focus from the
	link that revealed it would trap a keyboard user in a card they never asked
	to enter.
-->
<div
	role="presentation"
	onpointerenter={() => card.hold()}
	onpointerleave={() => card.scheduleClose()}
>
	<PopoverPopup
		bind:open={card.open}
		anchor={card.anchor}
		{side}
		{align}
		{label}
		manageFocus={false}
		class={cn('w-64 rounded-lg p-4', className)}
	>
		{@render children?.()}
	</PopoverPopup>
</div>
