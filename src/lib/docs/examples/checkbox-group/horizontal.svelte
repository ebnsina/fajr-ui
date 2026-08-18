<script lang="ts">
	import { CheckboxGroup, CheckboxGroupItem, Label } from '$lib/components/ui';

	const values = ['manuscripts', 'scholars', 'catalogue'];
	let sections = $state(['manuscripts']);
</script>

<CheckboxGroup bind:value={sections} {values} label="Sections to export" orientation="horizontal">
	<Label><CheckboxGroupItem value="manuscripts" /> Manuscripts</Label>
	<Label><CheckboxGroupItem value="scholars" /> Scholars</Label>
	<Label><CheckboxGroupItem value="catalogue" /> Catalogue</Label>
</CheckboxGroup>
