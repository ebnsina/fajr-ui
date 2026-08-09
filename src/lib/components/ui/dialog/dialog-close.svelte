<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button, { type ButtonProps } from '../button.svelte';
	import { useDialog } from './context.svelte';

	let { children, onclick, ...rest }: ButtonProps & { children?: Snippet } = $props();

	const dialog = useDialog();
</script>

<Button
	data-slot="dialog-close"
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) dialog.close();
	}}
	{...rest}
>
	{@render children?.()}
</Button>
