<script module lang="ts">
	import type { CheckboxProps } from '../checkbox.svelte';

	export type CheckboxGroupItemProps = Omit<CheckboxProps, 'checked' | 'indeterminate'> & {
		value: string;
	};
</script>

<script lang="ts">
	import Checkbox from '../checkbox.svelte';
	import { useCheckboxGroup } from './context.svelte';

	let { value, disabled, ...rest }: CheckboxGroupItemProps = $props();

	const group = useCheckboxGroup();
</script>

<!--
	A function binding rather than local state: the group is the single source of
	truth, so the box cannot drift out of step with the value it represents.
-->
<Checkbox
	bind:checked={() => group.has(value), (checked) => group.set(value, checked)}
	name={group.name}
	{value}
	disabled={disabled || group.disabled || undefined}
	{...rest}
/>
