<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type PreviewCardProps = {
		side?: Side;
		align?: Align;
		openDelay?: number;
		closeDelay?: number;
		class?: string;
		trigger?: Snippet;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import PreviewCardRoot from './preview-card-root.svelte';
	import PreviewCardTrigger from './preview-card-trigger.svelte';
	import PreviewCardPopup from './preview-card-popup.svelte';

	let {
		side = 'bottom',
		align = 'center',
		openDelay = 400,
		closeDelay = 200,
		class: className,
		trigger,
		children
	}: PreviewCardProps = $props();
</script>

<PreviewCardRoot {openDelay} {closeDelay}>
	<PreviewCardTrigger>{@render trigger?.()}</PreviewCardTrigger>
	<PreviewCardPopup {side} {align} class={className}>
		{@render children?.()}
	</PreviewCardPopup>
</PreviewCardRoot>
