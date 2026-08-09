<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button, { type ButtonProps } from '../button.svelte';
	import { usePopover } from './context.svelte';

	let { children, onclick, ...rest }: ButtonProps & { children?: Snippet } = $props();

	const popover = usePopover();
</script>

<!-- Registering itself as the anchor is the whole point: no `bind:ref` at the call site. -->
<Button
	bind:ref={popover.anchor}
	data-slot="popover-trigger"
	aria-haspopup="dialog"
	aria-expanded={popover.open}
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) popover.toggle();
	}}
	{...rest}
>
	{@render children?.()}
</Button>
