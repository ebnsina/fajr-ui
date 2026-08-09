<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { FieldProps } from '../field/field.svelte';

	export type FormFieldProps = Omit<FieldProps, 'invalid'> & {
		/** Matches the control's `name`, which is how the error is found. */
		name: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import Field from '../field/field.svelte';
	import FieldError from '../field/field-error.svelte';
	import { useForm } from './context.svelte';

	let { name, children, ...rest }: FormFieldProps = $props();

	const form = useForm();
	const error = $derived(form?.errorFor(name));
</script>

<!--
	The error is rendered by the field itself rather than left to the caller, so a
	validated field cannot be shipped without somewhere to show what went wrong.
-->
<Field invalid={Boolean(error)} {...rest}>
	{@render children?.()}
	{#if error}
		<FieldError>{error}</FieldError>
	{/if}
</Field>
