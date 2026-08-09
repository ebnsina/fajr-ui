<script lang="ts">
	import {
		Select,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectSeparator
	} from '$lib/components/ui';

	let instrument = $state<string | undefined>();
</script>

<div class="w-full max-w-xs">
	<Select bind:value={instrument} placeholder="Select an instrument">
		<SelectGroup>
			<SelectLabel>Astronomy</SelectLabel>
			<SelectItem value="astrolabe">Astrolabe</SelectItem>
			<SelectItem value="quadrant">Mural quadrant</SelectItem>
			<SelectItem value="armillary">Armillary sphere</SelectItem>
		</SelectGroup>
		<SelectSeparator />
		<SelectGroup>
			<SelectLabel>Timekeeping</SelectLabel>
			<SelectItem value="water-clock">Water clock</SelectItem>
			<SelectItem value="sundial">Sundial</SelectItem>
		</SelectGroup>
	</Select>
</div>
