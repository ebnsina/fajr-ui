<script lang="ts">
	import { Field, FieldError, FieldLabel, Input } from '$lib/components/ui';
</script>

<div class="w-full max-w-sm">
	<Field invalid>
		<FieldLabel>Work email</FieldLabel>
		<Input type="email" value="not-an-email" />
		<FieldError>Enter a valid email address.</FieldError>
	</Field>
</div>
