<script module lang="ts">
	import type { ComboboxRootProps } from './combobox-root.svelte';

	export type AutocompleteRootProps = Omit<ComboboxRootProps, 'freeform' | 'value' | 'query'> & {
		/** The text in the field. Free-form — it need not match a suggestion. */
		value?: string;
	};
</script>

<script lang="ts">
	import ComboboxRoot from './combobox-root.svelte';

	let {
		value = $bindable(''),
		open = $bindable(false),
		children,
		...rest
	}: AutocompleteRootProps = $props();
</script>

<!--
	Autocomplete suggests; it does not constrain. `freeform` makes the typed text
	the value, so an answer that matches no suggestion is still valid — the one
	behaviour that separates it from Combobox. Everything else is shared.
-->
<ComboboxRoot bind:query={value} bind:open freeform {...rest}>
	{@render children?.()}
</ComboboxRoot>
