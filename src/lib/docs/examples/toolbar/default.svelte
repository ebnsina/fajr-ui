<script lang="ts">
	import {
		Toolbar,
		ToolbarButton,
		ToolbarSeparator,
		ToggleGroup,
		ToggleGroupItem
	} from '$lib/components/ui';

	let marks = $state<string[]>(['bold']);
</script>

<Toolbar label="Formatting">
	<ToggleGroup type="multiple" bind:value={marks} label="Marks">
		<ToggleGroupItem value="bold" size="sm">B</ToggleGroupItem>
		<ToggleGroupItem value="italic" size="sm">I</ToggleGroupItem>
	</ToggleGroup>
	<ToolbarSeparator />
	<ToolbarButton size="sm" variant="ghost" onclick={() => (marks = [])}>Clear</ToolbarButton>
</Toolbar>
