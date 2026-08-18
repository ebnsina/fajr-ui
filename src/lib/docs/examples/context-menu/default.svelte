<script lang="ts">
	import { ContextMenu, MenuItem, MenuSeparator, MenuShortcut } from '$lib/components/ui';
</script>

<ContextMenu>
	{#snippet trigger()}
		<div class="rounded-xl border border-dashed px-10 py-8 text-sm text-muted-foreground">
			The Book of Optics — right click for actions
		</div>
	{/snippet}
	<MenuItem>Rename shelfmark<MenuShortcut>⌘R</MenuShortcut></MenuItem>
	<MenuItem>Duplicate entry</MenuItem>
	<MenuSeparator />
	<MenuItem variant="destructive">Remove from collection</MenuItem>
</ContextMenu>
