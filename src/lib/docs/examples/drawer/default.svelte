<script lang="ts">
	import { Button, Drawer } from '$lib/components/ui';

	let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Open drawer</Button>

<Drawer bind:open title="Filters">
	<div class="flex flex-col gap-3 p-6 pt-0">
		<p class="text-sm font-medium">Narrow the collection</p>
		<p class="text-sm text-muted-foreground">Drag the handle down, or press Escape, to close.</p>
		<Button onclick={() => (open = false)}>Apply</Button>
	</div>
</Drawer>
