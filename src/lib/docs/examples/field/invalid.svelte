<script lang="ts">
	import { Field, FieldError, FieldLabel, Input } from '$lib/components/ui';
</script>

<div class="w-full max-w-sm">
	<Field invalid>
		<FieldLabel>Reader's email</FieldLabel>
		<Input type="email" value="ibn.sina.bayt" />
		<FieldError>Enter a valid email address.</FieldError>
	</Field>
</div>
