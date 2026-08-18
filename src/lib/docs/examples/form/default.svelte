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
			<FieldLabel>Reader's email</FieldLabel>
			<Input name="email" type="email" placeholder="scholar@bayt-al-hikma.org" />
			<FieldDescription>Where the reading room confirmation is sent.</FieldDescription>
		</FormField>
		<Button type="submit">Request a desk</Button>
		{#if submitted}
			<p class="text-sm text-muted-foreground">Requested for: {submitted}</p>
		{/if}
	</Form>
</div>
