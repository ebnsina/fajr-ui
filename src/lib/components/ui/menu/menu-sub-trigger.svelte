<script module lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MenuSubTriggerProps = HTMLButtonAttributes & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { isRTL } from '$lib/internal/rtl';
	import { menuItemClass } from './menu-item.svelte';
	import { requireMenuSub } from './sub-context.svelte';

	let { class: className, children, ...rest }: MenuSubTriggerProps = $props();

	const sub = requireMenuSub();

	let trigger = $state<HTMLElement | null>(null);

	// Published so MenuSubPopup can anchor to this trigger.
	$effect(() => {
		if (trigger) sub.anchor = trigger;
	});

	function onkeydown(event: KeyboardEvent) {
		// Right opens and steps in; Enter and Space do the same.
		// The submenu opens toward the inline end, so the key that opens it is the
		// one pointing that way — Left when the menu is read right-to-left.
		const open = isRTL(event.currentTarget as Element) ? 'ArrowLeft' : 'ArrowRight';
		if (event.key === open || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			sub.openNow();
		}
	}
</script>

<button
	bind:this={trigger}
	type="button"
	role="menuitem"
	tabindex={-1}
	aria-haspopup="menu"
	aria-expanded={sub.open}
	aria-controls={sub.open ? sub.popupId : undefined}
	id={sub.triggerId}
	data-slot="menu-sub-trigger"
	data-state={sub.open ? 'open' : 'closed'}
	onpointerenter={() => sub.scheduleOpen()}
	onpointerleave={(event) => sub.scheduleClose(event, sub.popup)}
	onfocus={() => sub.openNow()}
	onclick={() => sub.openNow()}
	{onkeydown}
	class={cn(
		menuItemClass,
		'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
		className
	)}
	{...rest}
>
	{@render children?.()}
	<svg
		aria-hidden="true"
		class="ms-auto size-4 text-muted-foreground rtl:-scale-x-100"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="m9 18 6-6-6-6" />
	</svg>
</button>
