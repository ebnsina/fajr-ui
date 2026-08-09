<script module lang="ts">
	export type DataTableSearchProps = {
		/** The committed query. Bindable. */
		value?: string;
		placeholder?: string;
		/** Milliseconds of quiet before the query is committed. */
		wait?: number;
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Icon, SearchIcon } from '$lib/icons';
	import { InputGroup, InputGroupAddon, InputGroupInput } from '../input-group';
	import Button from '../button.svelte';
	import { untrack } from 'svelte';
	import { debounced } from '$lib/internal/pacer';

	let {
		value = $bindable(''),
		placeholder = 'Search…',
		wait = 300,
		class: className
	}: DataTableSearchProps = $props();

	// What the field shows, kept separate from the committed query so typing
	// stays responsive while the expensive work is paced.
	let draft = $state(value);

	const commit = debounced(
		(next: string) => (value = next),
		untrack(() => wait)
	);

	// Pending work is dropped on unmount so a torn-down table cannot be filtered.
	$effect(() => () => commit.cancel());

	function onkeydown(event: KeyboardEvent) {
		// Enter should not make you wait out the tail of the debounce.
		if (event.key === 'Enter') commit.flush();
		if (event.key === 'Escape') clear();
	}

	function clear() {
		draft = '';
		value = '';
		commit.cancel();
	}
</script>

<div class={cn('w-full max-w-xs', className)} data-slot="data-table-search">
	<InputGroup>
		<InputGroupAddon><Icon icon={SearchIcon} /></InputGroupAddon>
		<InputGroupInput
			type="search"
			{placeholder}
			aria-label={placeholder}
			bind:value={draft}
			oninput={() => commit(draft)}
			{onkeydown}
		/>
		{#if draft}
			<InputGroupAddon align="inline-end">
				<Button size="icon-sm" variant="ghost" aria-label="Clear search" onclick={clear}>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</Button>
			</InputGroupAddon>
		{/if}
	</InputGroup>
</div>
