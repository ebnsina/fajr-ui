<script lang="ts">
	import { CheckboxGroup, CheckboxGroupAll, CheckboxGroupItem, Label } from '$lib/components/ui';

	const values = ['manuscripts', 'scholars', 'catalogue'];
	let permissions = $state(['manuscripts']);
</script>

<CheckboxGroup bind:value={permissions} {values} label="Permissions" orientation="vertical">
	<Label><CheckboxGroupAll /> Select all</Label>
	<Label><CheckboxGroupItem value="manuscripts" /> Manuscripts</Label>
	<Label><CheckboxGroupItem value="scholars" /> Scholars</Label>
	<Label><CheckboxGroupItem value="catalogue" /> Catalogue</Label>
</CheckboxGroup>
