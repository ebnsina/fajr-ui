<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MenuCheckboxItemProps = Omit<HTMLButtonAttributes, 'onselect'> & {
		checked?: boolean;
		disabled?: boolean;
		/** Toggles usually stay open so several can be flipped in one visit. */
		closeOnSelect?: boolean;
		onselect?: (checked: boolean) => void;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useMenu } from './context.svelte';
	import { menuItemClass } from './menu-item.svelte';

	let {
		class: className,
		checked = $bindable(false),
		disabled = false,
		closeOnSelect = false,
		onselect,
		onclick,
		children,
		...rest
	}: MenuCheckboxItemProps = $props();

	const menu = useMenu();
</script>

<button
	type="button"
	role="menuitemcheckbox"
	aria-checked={checked}
	tabindex={-1}
	aria-disabled={disabled ? 'true' : undefined}
	data-slot="menu-checkbox-item"
	onclick={(event) => {
		if (disabled) return;
		onclick?.(event);
		checked = !checked;
		onselect?.(checked);
		if (closeOnSelect) menu.close();
	}}
	class={cn(menuItemClass, 'ps-7', className)}
	{...rest}
>
	<!-- The tick sits in reserved space, so labels stay aligned whether or not
	     an item is checked. -->
	<span class="absolute start-2 flex size-4 items-center justify-center">
		{#if checked}
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
</button>

<style>
	button {
		position: relative;
	}
</style>
