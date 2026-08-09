<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button, { type ButtonProps } from '../button.svelte';
	import { usePopover } from './context.svelte';

	let { children, onclick, ...rest }: ButtonProps & { children?: Snippet } = $props();

	const popover = usePopover();
</script>

<Button
	data-slot="popover-close"
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) popover.close();
	}}
	{...rest}
>
	{@render children?.()}
</Button>
