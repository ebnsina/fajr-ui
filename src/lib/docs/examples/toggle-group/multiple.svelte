<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui';

	let marks = $state<string[]>(['bold']);
</script>

<ToggleGroup type="multiple" bind:value={marks} label="Formatting">
	<ToggleGroupItem value="bold">B</ToggleGroupItem>
	<ToggleGroupItem value="italic">I</ToggleGroupItem>
	<ToggleGroupItem value="underline">U</ToggleGroupItem>
</ToggleGroup>
