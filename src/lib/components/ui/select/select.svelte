<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type SelectSize = 'sm' | 'default' | 'lg';

	export type SelectProps = Omit<HTMLButtonAttributes, 'value'> & {
		value?: string;
		open?: boolean;
		placeholder?: string;
		size?: SelectSize;
		side?: Side;
		align?: Align;
		/** Submits with the form via a hidden input. */
		name?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import PopoverPopup from '../popover/popover-popup.svelte';
	import { useField } from '../field/context.svelte';
	import { SelectState, setSelectContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		value = $bindable(),
		open = $bindable(false),
		placeholder = 'Select…',
		size = 'default',
		side = 'bottom',
		align = 'start',
		name,
		disabled,
		children,
		...rest
	}: SelectProps = $props();

	const field = useField();
	const isDisabled = $derived(Boolean(disabled || field?.disabled));

	let trigger = $state<HTMLElement | null>(null);

	/*
	 * Put focus back on the trigger when the list closes.
	 *
	 * The popup manages its own focus elsewhere, but this one opts out
	 * (`manageFocus={false}`) because it moves focus onto an option instead. That
	 * option lives in a container that becomes `display: none` on close, so the
	 * browser dropped focus to `<body>` — after choosing a value the user's place
	 * in the page was gone and the next Tab restarted from the top of the
	 * document. Escape did the same, so cancelling cost you your position too.
	 */
	let wasOpen = false;

	$effect(() => {
		if (wasOpen && !open) trigger?.focus({ preventScroll: true });
		wasOpen = open;
	});
	let listbox = $state<HTMLElement | null>(null);

	const select = setSelectContext(
		new SelectState({
			baseId,
			value: () => value,
			setValue: (next) => (value = next),
			close: () => (open = false),
			listbox: () => listbox
		})
	);

	// Opening lands on the current selection, not the top of the list — the same
	// place a native select puts you.
	$effect(() => {
		if (!open || !listbox) return;
		select.focusSelected();
	});

	function ontriggerkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
			event.preventDefault();
			open = true;
		}
	}

	function onlistkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				select.move(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				select.move(-1);
				return;
			case 'Home':
				event.preventDefault();
				select.focusFirst();
				return;
			case 'End':
				event.preventDefault();
				select.focusLast();
				return;
			case 'Tab':
				open = false;
				return;
		}

		if (!event.metaKey && !event.ctrlKey && !event.altKey && select.typeahead(event.key)) {
			event.preventDefault();
		}
	}
</script>

<button
	bind:this={trigger}
	type="button"
	role="combobox"
	aria-expanded={open}
	aria-haspopup="listbox"
	aria-controls={open ? `${baseId}-listbox` : undefined}
	id={field?.controlId}
	aria-describedby={field?.describedBy}
	aria-invalid={field?.invalid ? 'true' : undefined}
	disabled={isDisabled}
	data-slot="select-trigger"
	data-size={size}
	data-placeholder={select.selectedLabel === undefined ? '' : undefined}
	onclick={() => (open = !open)}
	onkeydown={ontriggerkeydown}
	class={cn(
		'flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-background px-[calc(--spacing(3)-1px)] text-base shadow-xs/5 ring-ring/24 transition-shadow outline-none not-dark:bg-clip-padding focus-visible:border-ring focus-visible:ring-[3px] disabled:opacity-64 aria-invalid:border-destructive/36 data-placeholder:text-muted-foreground sm:text-sm dark:bg-input/32 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-64',
		size === 'sm' && 'h-7.5 sm:h-6.5',
		size === 'default' && 'h-8.5 sm:h-7.5',
		size === 'lg' && 'h-9.5 sm:h-8.5',
		className
	)}
	{...rest}
>
	<span class="truncate">{select.selectedLabel ?? placeholder}</span>
	<svg
		aria-hidden="true"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
	</svg>
</button>

{#if name}
	<input type="hidden" {name} value={value ?? ''} />
{/if}

<PopoverPopup
	bind:open
	anchor={trigger}
	{side}
	{align}
	role="listbox"
	manageFocus={false}
	keepMounted
	id="{baseId}-listbox"
	onkeydown={onlistkeydown}
	class="max-h-[min(24rem,var(--available-height,24rem))] min-w-(--anchor-width) overflow-y-auto rounded-lg p-1"
	style="--anchor-width: {trigger?.offsetWidth ?? 0}px"
>
	<div bind:this={listbox} class="flex flex-col gap-0.5">
		{@render children?.()}
	</div>
</PopoverPopup>
