<script module lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export const toggleVariants = cva(
		"relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-medium text-base text-foreground outline-none transition-[color,background-color,box-shadow,transform] duration-(--duration-press) ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-64 aria-pressed:bg-input/64 aria-pressed:text-accent-foreground motion-reduce:active:scale-100 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5 [&_svg]:shrink-0",
		{
			defaultVariants: { size: 'default', variant: 'default' },
			variants: {
				size: {
					sm: 'h-8 min-w-8 rounded-md px-1.5 sm:h-7 sm:min-w-7',
					default: 'h-9 min-w-9 px-2 sm:h-8 sm:min-w-8',
					lg: 'h-10 min-w-10 px-2.5 sm:h-9 sm:min-w-9'
				},
				variant: {
					default: 'bg-transparent',
					outline:
						'border-input bg-background not-dark:bg-clip-padding dark:bg-input/32 dark:aria-pressed:bg-input'
				}
			}
		}
	);

	export type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>['variant']>;
	export type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>;

	export type ToggleProps = Omit<HTMLButtonAttributes, 'value'> & {
		pressed?: boolean;
		variant?: ToggleVariant;
		size?: ToggleSize;
		/** Identifies this toggle inside a ToggleGroup. */
		value?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useToggleGroup } from './toggle-group/context.svelte';

	let {
		class: className,
		pressed = $bindable(false),
		variant,
		size,
		value,
		onclick,
		children,
		...rest
	}: ToggleProps = $props();

	// Inside a group the group owns the state; standalone it owns its own.
	const group = useToggleGroup();
	const isPressed = $derived(group && value !== undefined ? group.isPressed(value) : pressed);
</script>

<!--
	`aria-pressed` rather than a checkbox role: a toggle is a button that stays
	down, and that is how it should be announced.
-->
<button
	type="button"
	aria-pressed={isPressed}
	data-slot="toggle"
	data-state={isPressed ? 'on' : 'off'}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		if (group && value !== undefined) group.toggle(value);
		else pressed = !pressed;
	}}
	class={cn(
		toggleVariants({ size: size ?? group?.size, variant: variant ?? group?.variant }),
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
