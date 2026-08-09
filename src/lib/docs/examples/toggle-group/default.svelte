<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui';

	let align = $state('left');
</script>

<ToggleGroup bind:value={align} variant="outline" label="Text alignment">
	<ToggleGroupItem value="left">Left</ToggleGroupItem>
	<ToggleGroupItem value="center">Center</ToggleGroupItem>
	<ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
