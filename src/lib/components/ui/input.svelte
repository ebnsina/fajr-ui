<script module lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type InputSize = 'sm' | 'default' | 'lg' | number;

	export type InputProps = Omit<HTMLInputAttributes, 'size'> & {
		size?: InputSize;
		/** Drops the wrapper's border/background so it can be composed inside another control. */
		unstyled?: boolean;
		/** Classes for the inner `<input>`; `class` styles the wrapper. */
		inputClass?: string;
		ref?: HTMLInputElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		inputClass,
		size = 'default',
		unstyled = false,
		type = 'text',
		value = $bindable(),
		ref = $bindable(null),
		...rest
	}: InputProps = $props();

	// Inside a <Field>, id/described-by/invalid/disabled come for free; explicit
	// props still win so a control can opt out of any of it.
	const field = useField();

	const inputClassName = $derived(
		cn(
			'h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] text-foreground leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground sm:h-7.5 sm:leading-7.5 autofill:[-webkit-text-fill-color:var(--foreground)]',
			size === 'sm' && 'h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 sm:h-6.5 sm:leading-6.5',
			size === 'lg' && 'h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5',
			type === 'search' &&
				'[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
			type === 'file' &&
				'text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm',
			inputClass
		)
	);

	const attrs = $derived({
		type,
		size: typeof size === 'number' ? size : undefined,
		id: field?.controlId,
		'aria-describedby': field?.describedBy,
		'aria-invalid': field?.invalid ? ('true' as const) : undefined,
		disabled: field?.disabled || undefined,
		...rest
	});
</script>

<span
	class={cn(
		!unstyled &&
			'relative inline-flex w-full rounded-lg border border-input bg-background text-base ring-ring ring-offset-background transition-shadow not-dark:bg-clip-padding has-autofill:bg-foreground/4 has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:ring-destructive data-[size=lg]:rounded-lg data-[size=sm]:rounded-md data-[size=sm]:rounded-md sm:rounded-md sm:text-sm data-[size=lg]:sm:rounded-lg data-[size=sm]:sm:rounded-md dark:bg-input/32 dark:has-autofill:bg-foreground/8',
		className
	) || undefined}
	data-size={size}
	data-slot="input-control"
>
	<input bind:this={ref} bind:value class={inputClassName} data-slot="input" {...attrs} />
</span>
