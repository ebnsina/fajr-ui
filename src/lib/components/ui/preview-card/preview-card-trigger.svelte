<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type PreviewCardTriggerProps = HTMLAttributes<HTMLSpanElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { usePreviewCard } from './context.svelte';

	let { class: className, children, ...rest }: PreviewCardTriggerProps = $props();

	const card = usePreviewCard();
</script>

<!-- Focus opens it too, so the hover handlers are an addition, not the only way in. -->
<span
	role="presentation"
	bind:this={card.anchor}
	data-slot="preview-card-trigger"
	class={cn('inline-flex', className)}
	onpointerenter={(event) => {
		// Touch has no hover; a preview that appears on tap cannot be dismissed.
		if (event.pointerType === 'touch') return;
		card.scheduleOpen();
	}}
	onpointerleave={() => card.scheduleClose()}
	onfocusin={() => card.openNow()}
	onfocusout={() => card.scheduleClose()}
	{...rest}
>
	{@render children?.()}
</span>
