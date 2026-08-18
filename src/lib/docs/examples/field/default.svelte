<script lang="ts">
	import { Field, FieldDescription, FieldLabel, Input } from '$lib/components/ui';
</script>

<div class="w-full max-w-sm">
	<Field>
		<FieldLabel>Reader's email</FieldLabel>
		<Input type="email" placeholder="scholar@bayt-al-hikma.org" />
		<FieldDescription>Only used for catalogue notices.</FieldDescription>
	</Field>
</div>
