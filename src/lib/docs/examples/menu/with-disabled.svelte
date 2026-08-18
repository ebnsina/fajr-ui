<script lang="ts">
	import { Button, Menu, MenuItem } from '$lib/components/ui';

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
	Collection actions
</Button>

<Menu bind:open anchor={trigger}>
	<MenuItem>Rename collection</MenuItem>
	<MenuItem disabled>Merge with another collection</MenuItem>
	<MenuItem>Export the catalogue</MenuItem>
</Menu>
