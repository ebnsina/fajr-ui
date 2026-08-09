<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button, { type ButtonProps } from '../button.svelte';

	let { children, variant = 'link', ...rest }: ButtonProps & { children?: Snippet } = $props();
</script>

<Button data-slot="toolbar-link" {variant} {...rest}>
	{@render children?.()}
</Button>
