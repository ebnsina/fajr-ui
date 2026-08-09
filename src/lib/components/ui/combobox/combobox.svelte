<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type ComboboxItemData = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type ComboboxProps = {
		items: ComboboxItemData[];
		value?: string;
		open?: boolean;
		placeholder?: string;
		size?: 'sm' | 'default' | 'lg';
		side?: Side;
		align?: Align;
		/** Submits with the form via a hidden input. */
		name?: string;
		/** Replace the match rule — the default is a case-insensitive substring. */
		filter?: (label: string, query: string) => boolean;
		/** Shown when nothing matches. */
		empty?: Snippet;
		/** Custom rendering for an option's contents. */
		option?: Snippet<[ComboboxItemData]>;
		class?: string;
	};
</script>

<script lang="ts">
	import ComboboxRoot from './combobox-root.svelte';
	import ComboboxInput from './combobox-input.svelte';
	import ComboboxList from './combobox-list.svelte';
	import ComboboxItem from './combobox-item.svelte';
	import ComboboxEmpty from './combobox-empty.svelte';

	let {
		items,
		value = $bindable(),
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
	}: ComboboxProps = $props();
</script>

<!--
	The common case, composed from the same parts you would use by hand. Reach for
	ComboboxRoot directly when options need groups, separators or custom rows.
-->
<ComboboxRoot bind:value bind:open {filter} class={className}>
	<ComboboxInput {placeholder} {size} />
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
</ComboboxRoot>

{#if name}
	<input type="hidden" {name} value={value ?? ''} />
{/if}
