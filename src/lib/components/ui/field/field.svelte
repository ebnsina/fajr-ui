<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type FieldProps = HTMLAttributes<HTMLDivElement> & {
		invalid?: boolean;
		disabled?: boolean;
		/** Override the generated id if the control already has one. */
		controlId?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { FieldState, setFieldContext } from './context.svelte';

	const generatedId = $props.id();

	let {
		class: className,
		invalid = false,
		disabled = false,
		controlId,
		children,
		...rest
	}: FieldProps = $props();

	setFieldContext(
		new FieldState({
			controlId: () => controlId ?? generatedId,
			invalid: () => invalid,
			disabled: () => disabled
		})
	);
</script>

<div
	data-slot="field"
	data-invalid={invalid ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
	class={cn('flex flex-col items-start gap-2', className)}
	{...rest}
>
	{@render children?.()}
</div>
