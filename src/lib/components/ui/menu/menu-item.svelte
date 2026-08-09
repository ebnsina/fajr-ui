<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MenuItemProps = Omit<HTMLButtonAttributes, 'onselect'> & {
		disabled?: boolean;
		/** Destructive items get the error tone. */
		variant?: 'default' | 'destructive';
		/** Keep the menu open after activating, e.g. for a toggle. */
		closeOnSelect?: boolean;
		onselect?: () => void;
		children?: Snippet;
	};

	export const menuItemClass =
		"flex min-h-8 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-start text-base outline-none transition-colors duration-100 ease-out focus:bg-accent focus:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:-mx-0.5 [&>svg]:shrink-0";
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useMenu } from './context.svelte';

	let {
		class: className,
		disabled = false,
		variant = 'default',
		closeOnSelect = true,
		onselect,
		onclick,
		children,
		...rest
	}: MenuItemProps = $props();

	const menu = useMenu();

	function activate(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (disabled) return;
		onclick?.(event);
		onselect?.();
		if (closeOnSelect) menu.close();
	}
</script>

<!--
	`tabindex={-1}` with focus moved by the menu's arrow keys: a menu is one tab
	stop, not one per item.
-->
<button
	type="button"
	role="menuitem"
	tabindex={-1}
	aria-disabled={disabled ? 'true' : undefined}
	data-slot="menu-item"
	data-variant={variant}
	onclick={activate}
	class={cn(
		menuItemClass,
		variant === 'destructive' &&
			'text-destructive-foreground focus:bg-destructive/8 dark:focus:bg-destructive/16',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
