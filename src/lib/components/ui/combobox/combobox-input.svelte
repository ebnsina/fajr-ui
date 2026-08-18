<script module lang="ts">
	import type { InputProps } from '../input.svelte';

	export type ComboboxInputProps = Omit<InputProps, 'value'> & {
		/** A chevron that opens the list. */
		showTrigger?: boolean;
		/** An X that clears the selection, shown once there is something to clear. */
		showClear?: boolean;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Input from '../input.svelte';
	import { useCombobox } from './context.svelte';
	import { useField } from '../field/context.svelte';

	let {
		class: className,
		inputClass,
		showTrigger = true,
		showClear = false,
		...rest
	}: ComboboxInputProps = $props();

	const combobox = useCombobox();
	const field = useField();

	let anchor = $state<HTMLElement | null>(null);
	$effect(() => {
		combobox.anchor = anchor;
	});

	const canClear = $derived(showClear && (combobox.value !== undefined || combobox.query !== ''));

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				combobox.move(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				combobox.move(-1);
				return;
			case 'Home':
				if (!combobox.open) return;
				event.preventDefault();
				combobox.first();
				return;
			case 'End':
				if (!combobox.open) return;
				event.preventDefault();
				combobox.last();
				return;
			case 'Enter':
				if (!combobox.open) return;
				event.preventDefault();
				combobox.choose();
				return;
			case 'Escape':
				event.preventDefault();
				// Close first, then clear on a second press, so one keypress never
				// throws away what was typed. The second half was documented but not
				// implemented — the early return meant Escape did nothing once the
				// list was closed, and the Clear button beside it is `tabindex="-1"`,
				// so there was no keyboard route to clearing at all.
				if (combobox.open) combobox.setOpen(false);
				else combobox.clear();
				return;
			case 'Tab':
				combobox.setOpen(false);
		}
	}
</script>

<div bind:this={anchor} class={cn('relative w-full', className)}>
	<Input
		role="combobox"
		aria-expanded={combobox.open}
		aria-controls={combobox.listId}
		aria-activedescendant={combobox.open ? combobox.activeId : undefined}
		aria-autocomplete="list"
		autocomplete="off"
		id={field?.controlId}
		aria-describedby={field?.describedBy}
		aria-invalid={field?.invalid ? 'true' : undefined}
		disabled={field?.disabled || undefined}
		value={combobox.text}
		oninput={(event) => combobox.setQuery(event.currentTarget.value)}
		onfocus={() => combobox.setOpen(true)}
		{onkeydown}
		inputClass={cn(showTrigger || canClear ? 'pe-8' : undefined, inputClass)}
		{...rest}
	/>

	{#if canClear}
		<button
			type="button"
			tabindex={-1}
			aria-label="Clear"
			onclick={() => combobox.clear()}
			class="absolute end-1 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
		>
			<svg
				aria-hidden="true"
				class="size-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<path d="M18 6 6 18M6 6l12 12" />
			</svg>
		</button>
	{:else if showTrigger}
		<button
			type="button"
			tabindex={-1}
			aria-label="Show options"
			onclick={() => combobox.setOpen(!combobox.open)}
			class="absolute end-1 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground opacity-64 hover:opacity-100"
		>
			<svg
				aria-hidden="true"
				class="size-4"
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
	{/if}
</div>
