<script lang="ts">
	import { Button, Menu, MenuCheckboxItem, MenuLabel } from '$lib/components/ui';

	let open = $state(false);
	let trigger = $state<HTMLElement | null>(null);
	let showGrid = $state(true);
	let showRulers = $state(false);
</script>

<Button
	bind:ref={trigger}
	variant="outline"
	aria-haspopup="menu"
	aria-expanded={open}
	onclick={() => (open = !open)}
>
	Open menu
</Button>

<Menu bind:open anchor={trigger}>
	<MenuLabel>Appearance</MenuLabel>
	<MenuCheckboxItem bind:checked={showGrid}>Show grid</MenuCheckboxItem>
	<MenuCheckboxItem bind:checked={showRulers}>Show rulers</MenuCheckboxItem>
</Menu>
