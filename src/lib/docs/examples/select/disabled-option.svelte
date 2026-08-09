<script lang="ts">
	import { Select, SelectItem } from '$lib/components/ui';

	let instrument = $state<string | undefined>();
</script>

<div class="w-full max-w-xs">
	<Select bind:value={instrument} placeholder="Select an instrument">
		<SelectItem value="astrolabe">Astrolabe</SelectItem>
		<SelectItem value="quadrant" disabled>Mural quadrant</SelectItem>
		<SelectItem value="armillary">Armillary sphere</SelectItem>
	</Select>
</div>
