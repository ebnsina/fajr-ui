<script lang="ts">
	import Checkbox, { type CheckboxProps } from '../checkbox.svelte';
	import { useCheckboxGroup } from './context.svelte';

	let { disabled, ...rest }: Omit<CheckboxProps, 'checked' | 'indeterminate'> = $props();

	const group = useCheckboxGroup();
</script>

<!--
	The parent box reports `mixed` when only some children are selected — the one
	state a plain checkbox cannot express, and the reason this component exists.
-->
<Checkbox
	bind:checked={() => group.allChecked, () => group.toggleAll()}
	indeterminate={group.someChecked}
	disabled={disabled || group.disabled || undefined}
	{...rest}
/>
