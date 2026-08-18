<script module lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	export type TextareaSize = 'sm' | 'default' | 'lg';

	export type TextareaProps = HTMLTextareaAttributes & {
		size?: TextareaSize;
		unstyled?: boolean;
		/** Classes for the inner `<textarea>`; `class` styles the wrapper. */
		textareaClass?: string;
		ref?: HTMLTextAreaElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useField } from './field/context.svelte';

	let {
		class: className,
		textareaClass,
		size = 'default',
		unstyled = false,
		value = $bindable(),
		ref = $bindable(null),
		...rest
	}: TextareaProps = $props();

	const field = useField();

	const attrs = $derived({
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
			'relative inline-flex w-full rounded-lg border border-input bg-background text-base ring-ring ring-offset-background transition-shadow not-dark:bg-clip-padding has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:ring-destructive sm:text-sm dark:bg-input/32',
		className
	) || undefined}
	data-size={size}
	data-slot="textarea-control"
>
	<!-- `field-sizing-content` grows the box with the text, no resize observer. -->
	<textarea
		bind:this={ref}
		bind:value
		data-slot="textarea"
		class={cn(
			'field-sizing-content min-h-17.5 w-full rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-foreground outline-none placeholder:text-muted-foreground max-sm:min-h-20.5',
			size === 'sm' &&
				'min-h-16.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)] max-sm:min-h-19.5',
			size === 'lg' && 'min-h-18.5 py-[calc(--spacing(2)-1px)] max-sm:min-h-21.5',
			textareaClass
		)}
		{...attrs}></textarea>
</span>
