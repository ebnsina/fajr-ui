<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Align, Side } from '$lib/internal/position';

	export type PopoverPopupProps = HTMLAttributes<HTMLDivElement> & {
		/** Defaults to the surrounding `<Popover>`'s state when there is one. */
		open?: boolean;
		/** The element to position against. A `<PopoverTrigger>` supplies this itself. */
		anchor?: HTMLElement | null;
		side?: Side;
		align?: Align;
		offset?: number;
		/** Accessible name, when the content has no heading of its own. */
		label?: string;
		/** Overridden by composers such as Menu, which need `role="menu"`. */
		role?: string;
		/**
		 * Set false when the composing component manages focus itself — Menu, for
		 * instance, focuses an item rather than the panel.
		 */
		manageFocus?: boolean;
		/**
		 * Keep the content mounted while closed. Select needs this: its options
		 * report their own labels, and unmounting them would lose the label of the
		 * currently selected value. A closed popover is `display: none`, so the
		 * content stays out of the accessibility tree either way.
		 */
		keepMounted?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { place, trackAnchor } from '$lib/internal/position';
	import { usePopoverOptional } from './context.svelte';

	let {
		class: className,
		open = $bindable(),
		anchor,
		side = 'bottom',
		align = 'center',
		offset = 6,
		label,
		role = 'dialog',
		manageFocus = true,
		keepMounted = false,
		style,
		children,
		...rest
	}: PopoverPopupProps = $props();

	/*
	 * The popup is also the positioning primitive behind Menu, Select and Date
	 * Picker, which drive it by prop. So context is a fallback, not a
	 * requirement — an explicit prop always wins.
	 */
	const popover = usePopoverOptional();
	const isOpen = $derived(open ?? popover?.open ?? false);
	const anchorEl = $derived(anchor ?? popover?.anchor ?? null);

	let popup = $state<HTMLDivElement | null>(null);
	let transformOrigin = $state('top center');
	let left = $state(0);
	let top = $state(0);

	function setOpen(next: boolean) {
		if (open !== undefined) open = next;
		else if (popover) popover.open = next;
	}

	function reposition() {
		if (!popup || !anchorEl) return;
		const placement = place(anchorEl.getBoundingClientRect(), popup.getBoundingClientRect(), {
			side,
			align,
			offset
		});
		left = placement.left;
		top = placement.top;
		transformOrigin = placement.transformOrigin;
	}

	// The Popover API puts this in the top layer, so it is never clipped by an
	// ancestor's `overflow: hidden` and never loses a z-index fight.
	$effect(() => {
		if (!popup) return;
		if (isOpen) {
			popup.showPopover();
			reposition();
		} else if (popup.matches(':popover-open')) {
			popup.hidePopover();
		}
	});

	$effect(() => {
		if (!isOpen || !anchorEl) return;
		return trackAnchor(anchorEl, reposition);
	});

	// Focus moves into the panel on open and back to the trigger on close, so
	// keyboard users are not dropped at the top of the document.
	$effect(() => {
		if (!isOpen || !popup || !manageFocus) return;
		const previous = document.activeElement as HTMLElement | null;
		const target = popup.querySelector<HTMLElement>(
			'[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		(target ?? popup).focus({ preventScroll: true });
		const panel = popup;
		/*
		 * Return focus only if it is still ours to move.
		 *
		 * Restoring unconditionally is a focus steal: a non-modal panel can be left
		 * open while the user tabs on or clicks something else, and closing it then
		 * yanked them back to the trigger — the next Tab resumed from the wrong
		 * place. `body` counts as ours because that is where focus lands when the
		 * element it was on has just been removed.
		 */
		return () => {
			const active = document.activeElement;
			if (panel.contains(active) || active === document.body || active === null) {
				previous?.focus({ preventScroll: true });
			}
		};
	});

	function onpointerdown(event: PointerEvent) {
		if (!isOpen || !popup) return;
		const target = event.target as Node;
		if (popup.contains(target) || anchorEl?.contains(target)) return;
		setOpen(false);
	}

	function onkeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') {
			event.preventDefault();
			setOpen(false);
		}
	}
</script>

<svelte:window {onpointerdown} {onkeydown} />

<!--
	The role is a prop, so the a11y linter cannot verify it statically. A dialog
	panel with `tabindex="-1"` is correct — it is programmatically focusable so
	focus can be moved into it, but never reachable by Tab.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={popup}
	popover="manual"
	{role}
	aria-label={popover?.titleRendered ? undefined : label}
	aria-labelledby={popover?.titleRendered ? popover.titleId : undefined}
	aria-describedby={popover?.descriptionRendered ? popover.descriptionId : undefined}
	tabindex={role === 'dialog' ? -1 : undefined}
	data-slot="popover"
	data-side={side}
	style="left: {left}px; top: {top}px; transform-origin: {transformOrigin}; {style ?? ''}"
	class={cn(
		'fixed z-50 m-0 w-max max-w-[calc(100vw-1rem)] rounded-lg border bg-popover p-0 text-popover-foreground shadow-lg/5 outline-none not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
		className
	)}
	{...rest}
>
	{#if isOpen || keepMounted}
		{@render children?.()}
	{/if}
</div>

<style>
	/*
	 * Scales from the trigger rather than from its own centre — the origin is set
	 * inline from the resolved side, so a popover that flips above its trigger
	 * grows downward from it.
	 *
	 * `allow-discrete` on `display` and `overlay` is what lets the exit animate;
	 * without it the panel leaves the top layer the instant it closes.
	 */
	[data-slot='popover'] {
		opacity: 0;
		scale: 0.97;
		transition:
			opacity var(--duration-popover) var(--ease-out),
			scale var(--duration-popover) var(--ease-out),
			display var(--duration-popover) allow-discrete,
			overlay var(--duration-popover) allow-discrete;
	}

	[data-slot='popover']:popover-open {
		opacity: 1;
		scale: 1;
	}

	@starting-style {
		[data-slot='popover']:popover-open {
			opacity: 0;
			scale: 0.97;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		[data-slot='popover'],
		[data-slot='popover']:popover-open {
			scale: 1;
		}

		@starting-style {
			[data-slot='popover']:popover-open {
				scale: 1;
			}
		}
	}
</style>
