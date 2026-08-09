<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ComboboxItemData } from './combobox.svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type AutocompleteItem = ComboboxItemData;

	export type AutocompleteProps = {
		items: AutocompleteItem[];
		/** The text in the field. Free-form — it need not match a suggestion. */
		value?: string;
		open?: boolean;
		placeholder?: string;
		size?: 'sm' | 'default' | 'lg';
		side?: Side;
		align?: Align;
		name?: string;
		filter?: (label: string, query: string) => boolean;
		empty?: Snippet;
		option?: Snippet<[AutocompleteItem]>;
		class?: string;
	};
</script>

<script lang="ts">
	import AutocompleteRoot from './autocomplete-root.svelte';
	import ComboboxInput from './combobox-input.svelte';
	import ComboboxList from './combobox-list.svelte';
	import ComboboxItem from './combobox-item.svelte';
	import ComboboxEmpty from './combobox-empty.svelte';

	let {
		items,
		value = $bindable(''),
		open = $bindable(false),
		placeholder = 'Search…',
		size = 'default',
		side = 'bottom',
		align = 'start',
		name,
		filter,
		empty,
		option,
		class: className
	}: AutocompleteProps = $props();
</script>

<AutocompleteRoot bind:value bind:open {filter} class={className}>
	<ComboboxInput {placeholder} {size} showClear />
	<ComboboxList {side} {align}>
		{#each items as item (item.value)}
			<ComboboxItem value={item.value} label={item.label} disabled={item.disabled}>
				{#if option}{@render option(item)}{:else}{item.label}{/if}
			</ComboboxItem>
		{/each}
		<ComboboxEmpty
			>{#if empty}{@render empty()}{/if}</ComboboxEmpty
		>
	</ComboboxList>
</AutocompleteRoot>

{#if name}
	<input type="hidden" {name} value={value ?? ''} />
{/if}
