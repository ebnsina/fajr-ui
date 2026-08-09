<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type CommandRootProps = {
		open?: boolean;
		query?: string;
		/** The `key` of the highlighted item, mirrored out for a footer to use. */
		activeKey?: string;
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import Dialog from '../dialog/dialog.svelte';
	import { CommandState, setCommandContext } from './context.svelte';

	const baseId = $props.id();

	let {
		open = $bindable(false),
		query = $bindable(''),
		// Not dead: `$bindable()` declares the prop, and line 55 writes through it so `bind:activeKey` reports the active item. The rule sees only an assignment overwritten before any read.
		// eslint-disable-next-line no-useless-assignment
		activeKey = $bindable(),
		label = 'Command palette',
		children
	}: CommandRootProps = $props();

	const command = setCommandContext(
		new CommandState({
			baseId,
			query: () => query,
			setQuery: (next) => (query = next),
			close: () => (open = false)
		})
	);

	// Reset between visits: a palette that reopens mid-search is disorienting.
	$effect(() => {
		if (!open) query = '';
	});

	// Filtering changes what is rendered, so the active option must be rechecked.
	$effect(() => {
		void query;
		void open;
		queueMicrotask(() => command.sync());
	});

	// Mirror the active item's key outward. Read from the DOM, so it settles
	// after the list has rendered rather than during it.
	$effect(() => {
		void command.activeId;
		void query;
		void open;
		queueMicrotask(() => (activeKey = command.activeKey));
	});
</script>

<!--
	No open or close animation. A palette opened by a keyboard shortcut is used
	dozens of times a day, and any delay between the keypress and a usable input
	makes the whole app feel slower than it is.
-->
<Dialog
	bind:open
	title={label}
	showCloseButton={false}
	class="top-[10vh] max-h-105 max-w-xl [--duration-popover:0ms]"
>
	<!--
		A muted ground behind everything, so the results panel reads as raised and
		the search row and hint bar read as chrome around it.
	-->
	<div class="flex min-h-0 flex-col bg-muted/72">
		{@render children?.()}
	</div>
</Dialog>
