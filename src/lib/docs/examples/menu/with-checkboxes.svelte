<script lang="ts">
	import { Button, Menu, MenuCheckboxItem, MenuLabel } from '$lib/components/ui';

	let open = $state(false);
	let trigger = $state<HTMLElement | null>(null);
	let showFolioNumbers = $state(true);
	let showMarginalia = $state(false);
</script>

<Button
	bind:ref={trigger}
	variant="outline"
	aria-haspopup="menu"
	aria-expanded={open}
	onclick={() => (open = !open)}
>
	Folio view
</Button>

<Menu bind:open anchor={trigger}>
	<MenuLabel>Show on the page</MenuLabel>
	<MenuCheckboxItem bind:checked={showFolioNumbers}>Folio numbers</MenuCheckboxItem>
	<MenuCheckboxItem bind:checked={showMarginalia}>Marginalia</MenuCheckboxItem>
</Menu>
