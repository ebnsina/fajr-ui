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
	Open menu
</Button>

<Menu bind:open anchor={trigger}>
	<MenuItem>Rename</MenuItem>
	<MenuItem disabled>Duplicate</MenuItem>
	<MenuItem>Archive</MenuItem>
</Menu>
