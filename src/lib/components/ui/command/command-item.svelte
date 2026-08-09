<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CommandItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> & {
		/** Extra terms that match without being displayed. */
		keywords?: string;
		/** Caller-supplied identity, readable as `command.activeKey`. */
		key?: string;
		/** Text used for matching; defaults to the rendered text. */
		value?: string;
		onselect?: () => void;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useCommand } from './context.svelte';

	const id = $props.id();

	let {
		class: className,
		keywords,
		key,
		value,
		onselect,
		children,
		...rest
	}: CommandItemProps = $props();

	const command = useCommand();
	let element = $state<HTMLElement | null>(null);

	// Match against the rendered text unless a value is given, so a plain item
	// needs no extra wiring.
	const haystack = $derived(`${value ?? element?.textContent ?? ''} ${keywords ?? ''}`);
	const visible = $derived(command.matches(haystack));
	const active = $derived(command.activeId === id);

	function run() {
		command.close();
		onselect?.();
	}
</script>

{#if visible}
	<!--
		Not focusable by design: focus stays in the input and the active option is
		pointed at with `aria-activedescendant`, which is what lets you keep typing
		while arrowing. Every key is handled on the input.
	-->
	<div
		bind:this={element}
		{id}
		role="option"
		aria-selected={active}
		data-active={active ? '' : undefined}
		data-slot="command-item"
		data-key={key}
		onclick={run}
		onpointermove={() => (command.activeId = id)}
		class={cn(
			"flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm select-none data-active:bg-accent data-active:text-accent-foreground [&>svg]:shrink-0 [&>svg]:opacity-64 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4",
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
{:else}
	<!-- Kept mounted but out of the tree so its text stays measurable for matching. -->
	<div bind:this={element} hidden>{@render children?.()}</div>
{/if}
