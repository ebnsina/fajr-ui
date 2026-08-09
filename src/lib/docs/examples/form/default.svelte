<script lang="ts">
	import { Button, FieldDescription, FieldLabel, Form, FormField, Input } from '$lib/components/ui';

	let errors = $state<Record<string, string | undefined>>({});
	let submitted = $state('');
</script>

<div class="w-full max-w-sm">
	<Form
		bind:errors
		validate={(data) => {
			const found: Record<string, string | undefined> = {};
			if (!String(data.email ?? '').includes('@')) {
				found.email = 'Enter a valid email address.';
			}
			return found;
		}}
		onsubmit={(data) => {
			submitted = String(data.email);
		}}
	>
		<FormField name="email">
			<FieldLabel>Work email</FieldLabel>
			<Input name="email" type="email" placeholder="you@example.com" />
			<FieldDescription>We only use this for confirmations.</FieldDescription>
		</FormField>
		<Button type="submit">Save</Button>
		{#if submitted}
			<p class="text-sm text-muted-foreground">Submitted: {submitted}</p>
		{/if}
	</Form>
</div>
