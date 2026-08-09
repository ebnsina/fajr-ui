<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type RadioGroupProps = HTMLAttributes<HTMLDivElement> & {
		value?: string;
		/** Shared by the underlying radios, and submitted with a form. */
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
	import { RadioGroupState, setRadioGroupContext } from './context.svelte';

	const generatedName = $props.id();

	let {
		class: className,
		value = $bindable(),
		name,
		disabled = false,
		orientation = 'vertical',
		label,
		children,
		...rest
	}: RadioGroupProps = $props();

	const field = useField();

	setRadioGroupContext(
		new RadioGroupState({
			name: () => name ?? generatedName,
			value: () => value,
			setValue: (next) => (value = next),
			disabled: () => disabled || Boolean(field?.disabled)
		})
	);
</script>

<div
	role="radiogroup"
	aria-orientation={orientation}
	aria-label={label}
	aria-describedby={field?.describedBy}
	aria-invalid={field?.invalid ? 'true' : undefined}
	data-slot="radio-group"
	class={cn(
		'flex gap-3',
		orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
