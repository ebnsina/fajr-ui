<script lang="ts">
	import { ContextMenu, MenuItem, MenuSeparator, MenuShortcut } from '$lib/components/ui';
</script>

<ContextMenu>
	{#snippet trigger()}
		<div class="rounded-xl border border-dashed px-10 py-8 text-sm text-muted-foreground">
			Right click here
		</div>
	{/snippet}
	<MenuItem>Rename<MenuShortcut>⌘R</MenuShortcut></MenuItem>
	<MenuItem>Duplicate</MenuItem>
	<MenuSeparator />
	<MenuItem variant="destructive">Delete</MenuItem>
</ContextMenu>
