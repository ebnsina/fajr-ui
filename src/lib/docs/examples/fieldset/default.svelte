<script lang="ts">
	import {
		Checkbox,
		Fieldset,
		FieldsetDescription,
		FieldsetLegend,
		Label
	} from '$lib/components/ui';
</script>

<div class="w-full max-w-md">
	<Fieldset>
		<FieldsetLegend>Notices</FieldsetLegend>
		<FieldsetDescription>Choose what the library writes to you about.</FieldsetDescription>
		<Label><Checkbox checked /> Catalogue notices</Label>
		<Label><Checkbox /> Weekly digest</Label>
		<Label><Checkbox /> New acquisitions</Label>
	</Fieldset>
</div>
