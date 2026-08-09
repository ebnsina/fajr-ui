<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type PopoverDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { usePopover } from './context.svelte';

	let { class: className, children, ...rest }: PopoverDescriptionProps = $props();

	const popover = usePopover();

	$effect(() => {
		popover.descriptionRendered = true;
		return () => (popover.descriptionRendered = false);
	});
</script>

<p
	id={popover.descriptionId}
	data-slot="popover-description"
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
