<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ComboboxItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
		value: string;
		/** Text used for matching and for the field; defaults to the rendered text. */
		label?: string;
		disabled?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useCombobox } from './context.svelte';

	const id = $props.id();

	let {
		class: className,
		value,
		label,
		disabled = false,
		children,
		...rest
	}: ComboboxItemProps = $props();

	const combobox = useCombobox();
	let element = $state<HTMLElement | null>(null);

	const text = $derived(label ?? element?.textContent?.trim() ?? value);
	const visible = $derived(combobox.matches(text));
	const active = $derived(combobox.activeId === id);
	const selected = $derived(combobox.value === value);

	// The chosen item reports its own text, so the field can show it without the
	// caller repeating the label anywhere.
	$effect(() => {
		if (selected) combobox.selectedLabel = text;
	});
</script>

{#if visible}
	<!--
		Not focusable by design: focus stays in the input and the active option is
		pointed at with `aria-activedescendant`, which is what lets you keep typing
		while arrowing.
	-->
	<div
		bind:this={element}
		{id}
		role="option"
		aria-selected={selected}
		aria-disabled={disabled ? 'true' : undefined}
		data-active={active ? '' : undefined}
		data-slot="combobox-item"
		onclick={() => !disabled && combobox.select(value, text)}
		onpointermove={() => !disabled && (combobox.activeId = id)}
		class={cn(
			'relative flex min-h-8 cursor-pointer items-center rounded-sm py-1 ps-7 pe-2 text-base select-none aria-disabled:pointer-events-none aria-disabled:opacity-64 data-active:bg-accent data-active:text-accent-foreground sm:min-h-7 sm:text-sm',
			className
		)}
		{...rest}
	>
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
	</div>
{:else}
	<!-- Kept mounted but out of the tree so its text stays measurable for matching. -->
	<div bind:this={element} hidden>{@render children?.()}</div>
{/if}
