<script lang="ts">
	import { Field, FieldError, FieldLabel, Select, SelectItem } from '$lib/components/ui';

	let observatory = $state<string | undefined>();
</script>

<div class="w-full max-w-xs">
	<Field invalid>
		<FieldLabel>Observatory</FieldLabel>
		<Select bind:value={observatory} placeholder="Select an observatory">
			<SelectItem value="maragheh">Maragheh</SelectItem>
			<SelectItem value="ulugh-beg">Ulugh Beg, Samarkand</SelectItem>
			<SelectItem value="shammasiyah">Al-Shammasiyah, Baghdad</SelectItem>
		</Select>
		<FieldError>Pick an observatory to continue.</FieldError>
	</Field>
</div>
