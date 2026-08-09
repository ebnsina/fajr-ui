<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { usePopover } from './context.svelte';

	let { class: className, children, ...rest }: PopoverTitleProps = $props();

	const popover = usePopover();

	$effect(() => {
		popover.titleRendered = true;
		return () => (popover.titleRendered = false);
	});
</script>

<h3
	id={popover.titleId}
	data-slot="popover-title"
	class={cn('text-sm font-medium', className)}
	{...rest}
>
	{@render children?.()}
</h3>
