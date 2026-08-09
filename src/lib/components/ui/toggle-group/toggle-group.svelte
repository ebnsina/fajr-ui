<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { ToggleSize, ToggleVariant } from '../toggle.svelte';

	export type ToggleGroupProps = HTMLAttributes<HTMLDivElement> & {
		type?: 'single' | 'multiple';
		value?: string | string[];
		variant?: ToggleVariant;
		size?: ToggleSize;
		/** Accessible name for the set. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ToggleGroupState, setToggleGroupContext } from './context.svelte';

	let {
		class: className,
		type = 'single',
		value = $bindable(),
		variant,
		size,
		label,
		children,
		...rest
	}: ToggleGroupProps = $props();

	setToggleGroupContext(
		new ToggleGroupState({
			type: () => type,
			value: () => value,
			setValue: (next) => (value = next as string | string[] | undefined),
			variant: () => variant,
			size: () => size
		})
	);
</script>

<div
	role="group"
	aria-label={label}
	data-slot="toggle-group"
	data-type={type}
	class={cn(
		'isolate flex items-center gap-1',
		// Outline groups collapse the seam between neighbours into one border.
		variant === 'outline' &&
			'gap-0 *:not-first:-ms-px *:not-first:rounded-s-none *:not-last:rounded-e-none *:hover:z-10 *:focus-visible:z-10 *:aria-pressed:z-10',
		className
	)}
	data-variant={variant}
	{...rest}
>
	{@render children?.()}
</div>
