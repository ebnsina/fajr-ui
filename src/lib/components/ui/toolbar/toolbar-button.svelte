<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button, { type ButtonProps } from '../button.svelte';

	let { children, ...rest }: ButtonProps & { children?: Snippet } = $props();
</script>

<!--
	A Button that the toolbar's roving tab index can find. The toolbar collects
	focusable descendants, so this needs no registration of its own — the data
	attribute is for styling and for tests.
-->
<Button data-slot="toolbar-button" {...rest}>
	{@render children?.()}
</Button>
