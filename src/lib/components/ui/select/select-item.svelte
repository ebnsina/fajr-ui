<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SelectItemProps = Omit<HTMLButtonAttributes, 'value'> & {
		value: string;
		disabled?: boolean;
		/** Overrides the text used for the trigger label and typeahead. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useSelect } from './context.svelte';

	let {
		class: className,
		value,
		disabled = false,
		label,
		children,
		onclick,
		...rest
	}: SelectItemProps = $props();

	const select = useSelect();
	const selected = $derived(select.value === value);

	let element = $state<HTMLButtonElement | null>(null);

	// Report the option's text so the trigger can display it. Falls back to the
	// rendered text, so `label` is only needed for non-textual content.
	$effect(() => select.register(value, label ?? element?.textContent?.trim() ?? value));
</script>

<button
	bind:this={element}
	type="button"
	role="option"
	id={select.optionId(value)}
	aria-selected={selected}
	aria-disabled={disabled ? 'true' : undefined}
	tabindex={-1}
	data-slot="select-item"
	data-value={value}
	onclick={(event) => {
		if (disabled) return;
		onclick?.(event);
		select.select(value);
	}}
	class={cn(
		'relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-sm py-1 ps-7 pe-2 text-start text-base transition-colors duration-100 ease-out outline-none select-none focus:bg-accent focus:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-64 sm:min-h-7 sm:text-sm',
		className
	)}
	{...rest}
>
	<!-- The tick sits in reserved space so labels line up regardless of selection. -->
	<span class="absolute start-2 flex size-4 items-center justify-center">
		{#if selected}
			<svg
				aria-hidden="true"
				class="size-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
			</svg>
		{/if}
	</span>
	{@render children?.()}
</button>
