<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type PreviewCardRootProps = {
		/** Delay before it appears, in milliseconds. */
		openDelay?: number;
		/** Grace period before it closes, so the pointer can travel into it. */
		closeDelay?: number;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { PreviewCardState, setPreviewCardContext } from './context.svelte';

	let { openDelay = 400, closeDelay = 200, children }: PreviewCardRootProps = $props();

	setPreviewCardContext(
		new PreviewCardState({ openDelay: () => openDelay, closeDelay: () => closeDelay })
	);
</script>

{@render children?.()}
