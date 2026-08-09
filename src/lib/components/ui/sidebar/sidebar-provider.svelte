<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SidebarProviderProps = HTMLAttributes<HTMLDivElement> & {
		defaultOpen?: boolean;
		open?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { cn } from '$lib/utils';
	import {
		SIDEBAR_COOKIE_MAX_AGE,
		SIDEBAR_COOKIE_NAME,
		SIDEBAR_KEYBOARD_SHORTCUT,
		SIDEBAR_WIDTH,
		SIDEBAR_WIDTH_ICON,
		SidebarState,
		setSidebarContext
	} from './context.svelte';

	let {
		class: className,
		style,
		defaultOpen = true,
		open = $bindable(defaultOpen),
		children,
		...rest
	}: SidebarProviderProps = $props();

	// Below Tailwind's md breakpoint.
	const isMobile = new MediaQuery('max-width: 767.98px');

	const sidebar = setSidebarContext(
		new SidebarState({
			open: () => open,
			isMobile: () => isMobile.current,
			setOpen: (value) => {
				open = value;
				document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
			}
		})
	);

	function onkeydown(event: KeyboardEvent) {
		if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			sidebar.toggle();
		}
	}
</script>

<svelte:window {onkeydown} />

<div
	data-slot="sidebar-wrapper"
	style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style ??
		''}"
	class={cn(
		'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
