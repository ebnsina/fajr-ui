<script lang="ts">
	import { Checkbox, Field, FieldDescription, FieldItem, FieldLabel } from '$lib/components/ui';
</script>

<div class="w-full max-w-sm">
	<Field>
		<FieldItem>
			<Checkbox />
			<div>
				<FieldLabel>Tell me about new acquisitions</FieldLabel>
				<FieldDescription>About one message a month.</FieldDescription>
			</div>
		</FieldItem>
	</Field>
</div>
