<script module lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type RadioGroupItemProps = Omit<HTMLInputAttributes, 'type' | 'checked'> & {
		value: string;
		disabled?: boolean;
		ref?: HTMLInputElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useRadioGroup } from './context.svelte';

	let {
		class: className,
		value,
		disabled = false,
		ref = $bindable(null),
		...rest
	}: RadioGroupItemProps = $props();

	const group = useRadioGroup();
	const selected = $derived(group.isSelected(value));
	const isDisabled = $derived(disabled || group.disabled);
</script>

<span
	data-slot="radio-group-item"
	data-state={selected ? 'checked' : 'unchecked'}
	class={cn(
		'relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-full border border-input bg-background ring-ring transition-shadow not-dark:bg-clip-padding has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background has-disabled:cursor-not-allowed has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/48 sm:size-4 dark:not-data-[state=checked]:bg-input/32 dark:has-aria-invalid:ring-destructive/24',
		className
	)}
>
	<!--
		Real radios sharing a name. The browser then supplies arrow-key movement,
		wrapping, and the roving tab stop that makes a group one stop rather than
		one per option — all of which a div-based implementation has to rebuild,
		usually incompletely.
	-->
	<input
		bind:this={ref}
		type="radio"
		name={group.name}
		{value}
		checked={selected}
		disabled={isDisabled}
		onchange={() => group.select(value)}
		data-slot="radio-group-input"
		class="absolute inset-0 z-1 cursor-pointer opacity-0 disabled:cursor-not-allowed pointer-coarse:-inset-3.5"
		{...rest}
	/>
	{#if selected}
		<span
			data-slot="radio-group-indicator"
			class="pointer-events-none absolute -inset-px flex items-center justify-center rounded-full bg-primary"
		>
			<span class="size-1.5 rounded-full bg-primary-foreground sm:size-1.5"></span>
		</span>
	{/if}
</span>
