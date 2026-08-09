<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button, { type ButtonProps } from '../button.svelte';
	import { useSheet } from './context.svelte';

	let { children, onclick, ...rest }: ButtonProps & { children?: Snippet } = $props();

	const sheet = useSheet();
</script>

<Button
	data-slot="sheet-trigger"
	aria-haspopup="dialog"
	aria-expanded={sheet.open}
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) sheet.toggle();
	}}
	{...rest}
>
	{@render children?.()}
</Button>
