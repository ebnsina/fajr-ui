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
		<FieldsetLegend>Notifications</FieldsetLegend>
		<FieldsetDescription>Choose what we email you about.</FieldsetDescription>
		<Label><Checkbox checked /> Catalogue notices</Label>
		<Label><Checkbox /> Weekly summary</Label>
		<Label><Checkbox /> Product updates</Label>
	</Fieldset>
</div>
