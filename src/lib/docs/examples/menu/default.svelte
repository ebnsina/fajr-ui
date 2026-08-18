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
	Manuscript actions
</Button>

<Menu bind:open anchor={trigger}>
	<MenuItem>Rename shelfmark<MenuShortcut>⌘R</MenuShortcut></MenuItem>
	<MenuItem>Duplicate entry</MenuItem>
	<MenuItem>Send to the bindery</MenuItem>
	<MenuSeparator />
	<MenuItem variant="destructive">Delete manuscript<MenuShortcut>⌘⌫</MenuShortcut></MenuItem>
</Menu>
