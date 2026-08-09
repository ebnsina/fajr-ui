<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type ComboboxRootProps = {
		value?: string;
		query?: string;
		open?: boolean;
		/** Autocomplete sets this: the typed text is the value, not a constraint. */
		freeform?: boolean;
		filter?: (label: string, query: string) => boolean;
		class?: string;
		children?: Snippet;
	};

	const defaultFilter = (label: string, query: string) =>
		label.toLowerCase().includes(query.trim().toLowerCase());
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ComboboxState, setComboboxContext } from './context.svelte';

	const baseId = $props.id();

	let {
		value = $bindable(),
		query = $bindable(''),
		open = $bindable(false),
		freeform = false,
		filter = defaultFilter,
		class: className,
		children
	}: ComboboxRootProps = $props();

	const combobox = setComboboxContext(
		new ComboboxState({
			baseId,
			value: () => value,
			setValue: (next) => (value = next),
			query: () => query,
			setQuery: (next) => (query = next),
			open: () => open,
			setOpen: (next) => (open = next),
			freeform: () => freeform,
			filter: (label, query) => filter(label, query)
		})
	);

	// Filtering changes what is rendered, so the active option must be rechecked.
	$effect(() => {
		void query;
		void open;
		queueMicrotask(() => combobox.sync());
	});
</script>

<div data-slot="combobox" class={cn('relative w-full', className)}>
	{@render children?.()}
</div>
