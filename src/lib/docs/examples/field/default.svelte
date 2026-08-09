<script lang="ts">
	import { Field, FieldDescription, FieldLabel, Input } from '$lib/components/ui';
</script>

<div class="w-full max-w-sm">
	<Field>
		<FieldLabel>Work email</FieldLabel>
		<Input type="email" placeholder="you@example.com" />
		<FieldDescription>Only used for catalogue notices.</FieldDescription>
	</Field>
</div>
