<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { Side } from '$lib/internal/position';

	/**
	 * Spread onto your own trigger element. Nothing is wrapped, so sibling
	 * selectors keep working and `aria-describedby` lands on the element that is
	 * actually focused.
	 */
	export type TooltipTriggerProps = {
		'aria-describedby': string | undefined;
		onpointerenter: (event: PointerEvent) => void;
		onpointerleave: () => void;
		onpointerdown: () => void;
		onfocus: (event: FocusEvent) => void;
		onblur: () => void;
		onkeydown: (event: KeyboardEvent) => void;
	};

	export type TooltipProps = {
		side?: Side;
		/** Skip rendering entirely — e.g. a sidebar tooltip while expanded. */
		disabled?: boolean;
		open?: boolean;
		class?: string;
		/** Your trigger. Spread the argument onto whichever element you render. */
		trigger: Snippet<[TooltipTriggerProps]>;
		/** The tooltip body. Unlike the action, this can be markup. */
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { place, trackAnchor } from '$lib/internal/position';
	import { OPEN_DELAY, TooltipState, isInstant, setTooltipContext } from './context.svelte';

	let {
		side = 'top',
		disabled = false,
		open = $bindable(false),
		class: className,
		trigger,
		children
	}: TooltipProps = $props();

	const contentId = $props.id();

	const tooltip = setTooltipContext(
		new TooltipState({
			open: () => open,
			setOpen: (next) => (open = next),
			contentId: () => contentId
		})
	);

	let anchor = $state<HTMLElement | null>(null);
	let popup = $state<HTMLElement | null>(null);
	let openTimer: ReturnType<typeof setTimeout> | undefined;

	const GAP = 6;

	function reposition() {
		if (!anchor || !popup) return;
		const placement = place(anchor.getBoundingClientRect(), popup.getBoundingClientRect(), {
			side,
			offset: GAP
		});
		popup.style.left = `${placement.left}px`;
		popup.style.top = `${placement.top}px`;
		popup.style.transformOrigin = placement.transformOrigin;
	}

	/*
	 * Position once the popup is in the DOM and measurable, then follow the
	 * anchor while it is open — a tooltip on a control inside a scrolling panel
	 * has to travel with it rather than stay where it was first drawn.
	 */
	$effect(() => {
		if (!open || !popup) return;
		reposition();
		return trackAnchor(anchor ?? popup, reposition);
	});

	function scheduleShow(event: Event) {
		if (disabled || !children) return;
		anchor = event.currentTarget as HTMLElement;
		clearTimeout(openTimer);
		openTimer = setTimeout(() => tooltip.show(), isInstant() ? 0 : OPEN_DELAY);
	}

	function hide() {
		clearTimeout(openTimer);
		tooltip.hide();
	}

	const triggerProps: TooltipTriggerProps = {
		get 'aria-describedby'() {
			return open ? contentId : undefined;
		},
		onpointerenter(event: PointerEvent) {
			// Touch fires pointerenter on tap, which would show a tooltip nobody
			// asked for and cannot dismiss.
			if (event.pointerType === 'touch') return;
			scheduleShow(event);
		},
		onpointerleave: hide,
		onpointerdown: hide,
		onfocus(event: FocusEvent) {
			// Keyboard focus only, so clicking a button does not summon one.
			const target = event.currentTarget as HTMLElement;
			if (target.matches(':focus-visible')) {
				anchor = target;
				tooltip.show();
			}
		},
		onblur: hide,
		onkeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') hide();
		}
	};

	$effect(() => () => clearTimeout(openTimer));
</script>

{@render trigger(triggerProps)}

{#if open && children}
	<!--
		The top layer, so the tooltip is never clipped by an ancestor's
		`overflow: hidden` and never loses a z-index fight. `pointer-events-none`
		because a tooltip that can be hovered is a popover.
	-->
	<div
		bind:this={popup}
		id={contentId}
		role="tooltip"
		data-slot="tooltip-content"
		{@attach (node) => node.showPopover?.()}
		popover="manual"
		class={cn(
			'pointer-events-none fixed z-50 m-0 w-max max-w-64 rounded-md border bg-popover px-2 py-1 text-xs text-balance text-popover-foreground shadow-md/5 not-dark:bg-clip-padding',
			'',
			!isInstant() &&
				'animate-in fade-in-0 zoom-in-95 duration-(--duration-popover) motion-reduce:animate-none',
			className
		)}
	>
		{@render children()}
	</div>
{/if}
