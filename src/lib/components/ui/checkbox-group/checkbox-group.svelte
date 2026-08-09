<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CheckboxGroupProps = HTMLAttributes<HTMLDivElement> & {
		value?: string[];
		/** Every selectable value. Required for the select-all parent to work. */
		values?: string[];
		name?: string;
		disabled?: boolean;
		orientation?: 'vertical' | 'horizontal';
		/** Accessible name, when there is no surrounding field label. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useField } from '../field/context.svelte';
	import { CheckboxGroupState, setCheckboxGroupContext } from './context.svelte';

	let {
		class: className,
		value = $bindable([]),
		values = [],
		name,
		disabled = false,
		orientation = 'vertical',
		label,
		children,
		...rest
	}: CheckboxGroupProps = $props();

	const field = useField();

	setCheckboxGroupContext(
		new CheckboxGroupState({
			value: () => value,
			setValue: (next) => (value = next),
			allValues: () => values,
			disabled: () => disabled || Boolean(field?.disabled),
			name: () => name
		})
	);
</script>

<div
	role="group"
	data-orientation={orientation}
	aria-label={label}
	aria-describedby={field?.describedBy}
	data-slot="checkbox-group"
	class={cn(
		'flex gap-3',
		orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
