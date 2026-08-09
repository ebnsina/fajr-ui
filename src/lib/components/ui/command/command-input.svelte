<script module lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type CommandInputProps = Omit<HTMLInputAttributes, 'value'> & {
		placeholder?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Icon, SearchIcon } from '$lib/icons';
	import { useCommand } from './context.svelte';

	let {
		class: className,
		placeholder = 'Type a command or search…',
		...rest
	}: CommandInputProps = $props();

	const command = useCommand();

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				command.move(1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				command.move(-1);
				return;
			case 'Home':
				event.preventDefault();
				command.first();
				return;
			case 'End':
				event.preventDefault();
				command.last();
				return;
			case 'Enter':
				event.preventDefault();
				command.run();
		}
	}
</script>

<div class={cn('flex items-center gap-2.5 px-4 py-1.5', className)} data-slot="command-input">
	<Icon
		icon={SearchIcon}
		class="size-4.5 shrink-0 text-muted-foreground sm:size-4"
		aria-hidden="true"
	/>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		autofocus
		type="text"
		role="combobox"
		aria-expanded="true"
		aria-controls={command.listId}
		aria-activedescendant={command.activeId}
		aria-autocomplete="list"
		autocomplete="off"
		{placeholder}
		value={command.query}
		oninput={(event) => command.setQuery(event.currentTarget.value)}
		{onkeydown}
		class="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
		{...rest}
	/>
</div>
