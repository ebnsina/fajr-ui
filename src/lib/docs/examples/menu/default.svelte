<script lang="ts">
	import { Button, Menu, MenuItem, MenuSeparator, MenuShortcut } from '$lib/components/ui';

	let open = $state(false);
	let trigger = $state<HTMLElement | null>(null);
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
	<MenuItem>Rename<MenuShortcut>⌘R</MenuShortcut></MenuItem>
	<MenuItem>Duplicate</MenuItem>
	<MenuItem>Archive</MenuItem>
	<MenuSeparator />
	<MenuItem variant="destructive">Delete<MenuShortcut>⌘⌫</MenuShortcut></MenuItem>
</Menu>
