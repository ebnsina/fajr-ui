<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { MenuProps } from './menu/menu.svelte';

	export type ContextMenuProps = Omit<MenuProps, 'anchor' | 'side' | 'align'> & {
		/** The region that opens the menu on right click or long press. */
		trigger?: Snippet;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Menu from './menu/menu.svelte';

	let {
		class: className,
		open = $bindable(false),
		trigger,
		children,
		...rest
	}: ContextMenuProps = $props();

	// A zero-size element parked at the pointer, so the existing anchored Menu
	// positions against the click point without needing its own code path.
	let anchor = $state<HTMLElement | null>(null);
	let x = $state(0);
	let y = $state(0);

	let longPress: ReturnType<typeof setTimeout> | undefined;

	function openAt(clientX: number, clientY: number) {
		x = clientX;
		y = clientY;
		open = true;
	}

	function oncontextmenu(event: MouseEvent) {
		event.preventDefault();
		openAt(event.clientX, event.clientY);
	}

	/** Touch has no right click, so a long press stands in for it. */
	function onpointerdown(event: PointerEvent) {
		if (event.pointerType !== 'touch') return;
		clearTimeout(longPress);
		longPress = setTimeout(() => openAt(event.clientX, event.clientY), 500);
	}

	function cancelLongPress() {
		clearTimeout(longPress);
	}

	let region = $state<HTMLElement | null>(null);

	/**
	 * The keyboard route in.
	 *
	 * Right click and long press are pointer gestures with no keyboard
	 * equivalent, so without this the menu could not be opened at all without a
	 * mouse — and anything reachable only from it was unreachable (WCAG 2.1.1).
	 * `ContextMenu` and Shift+F10 are what the platform already uses for this.
	 *
	 * There is no pointer position to anchor to, so the menu opens against the
	 * region itself rather than at a coordinate the user never chose.
	 */
	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)) return;
		event.preventDefault();
		const box = region?.getBoundingClientRect();
		openAt(box ? box.left + box.width / 2 : 0, box ? box.bottom : 0);
	}
</script>

<!--
	Focusable, so the menu has a keyboard route at all: right click and long press
	are both pointer-only gestures.

	`role="button"` is what carries `aria-haspopup` — `group` and the implicit
	generic role do not support it, and without it nothing tells the user a menu
	is available here. The region takes the whole affordance rather than the
	content inside it, which is arbitrary and may be plain text.
-->
<div
	bind:this={region}
	role="button"
	tabindex="0"
	aria-haspopup="menu"
	aria-expanded={open}
	data-slot="context-menu-trigger"
	class={cn(
		'w-fit rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		className
	)}
	{oncontextmenu}
	{onkeydown}
	{onpointerdown}
	onpointerup={cancelLongPress}
	onpointercancel={cancelLongPress}
	onpointermove={cancelLongPress}
>
	{@render trigger?.()}
</div>

<div
	bind:this={anchor}
	aria-hidden="true"
	class="pointer-events-none fixed size-0"
	style="left: {x}px; top: {y}px"
></div>

<Menu bind:open {anchor} side="bottom" align="start" {...rest}>
	{@render children?.()}
</Menu>
