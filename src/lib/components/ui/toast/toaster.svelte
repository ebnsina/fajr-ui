<script module lang="ts">
	export type ToasterProps = {
		position?:
			'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
		/** How many stay visible before the rest are hidden behind the pile. */
		visibleToasts?: number;
		class?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ErrorIcon, Icon, InfoIcon, SpinnerIcon, SuccessIcon, WarningIcon } from '$lib/icons';
	import Button from '../button.svelte';
	import { toaster, type Toast } from './state.svelte';

	let { position = 'bottom-right', visibleToasts = 3, class: className }: ToasterProps = $props();

	const TONE_ICON = {
		success: SuccessIcon,
		warning: WarningIcon,
		error: ErrorIcon,
		info: InfoIcon,
		loading: SpinnerIcon
	} as const;

	const TONE_COLOR = {
		success: 'text-success',
		warning: 'text-warning',
		error: 'text-destructive',
		info: 'text-info',
		loading: 'text-muted-foreground'
	} as const;

	const fromTop = $derived(position.startsWith('top'));
	/** The stack grows away from the edge it sits on. */
	const direction = $derived(fromTop ? 1 : -1);

	/** How far each card behind peeks out, and how much it shrinks. */
	const PEEK = 12;
	const SCALE_STEP = 0.1;
	const GAP = 12;

	let expanded = $state(false);
	let nodes = $state<(HTMLElement | null)[]>([]);
	let heights = $state<number[]>([]);

	/**
	 * Measured from the elements rather than with `bind:clientHeight`, which only
	 * writes when the height itself changes. Toasts are prepended, so a card's
	 * index shifts while its height stays the same — the binding would never
	 * rewrite under the new index and the stack would lay out on stale numbers.
	 */
	function measure() {
		heights = nodes.map((node) => node?.offsetHeight ?? 0);
	}

	$effect(() => {
		// Re-measure whenever the queue changes or the stack expands.
		void toaster.toasts.length;
		void expanded;
		measure();

		const observer = new ResizeObserver(measure);
		for (const node of nodes) if (node) observer.observe(node);
		return () => observer.disconnect();
	});

	// Every Toaster renders the whole shared queue, so a second one duplicates
	// every toast on screen. Silent duplication is confusing to debug; say so.
	$effect(() => {
		if (!import.meta.env.DEV) return;
		if (document.querySelectorAll('[data-slot="toaster"]').length > 1) {
			console.warn(
				'[fajr-ui] More than one <Toaster /> is mounted. Each renders the whole queue, so toasts will appear more than once. Mount it exactly once, near the root.'
			);
		}
	});

	// A background tab should not burn through a toast's lifetime unseen.
	function onvisibilitychange() {
		if (document.hidden) toaster.pause();
		else toaster.resume();
	}

	/**
	 * Collapsed, the cards sit in a pile: each one behind peeks out by a fixed
	 * amount and is scaled down slightly, which reads as depth rather than as a
	 * list. Expanded, they lay out by their real heights so every message is
	 * readable — which is why the heights are measured rather than assumed.
	 */
	function offsetFor(index: number): number {
		if (!expanded) return direction * index * PEEK;
		let total = 0;
		for (let i = 0; i < index; i++) total += (heights[i] ?? 0) + GAP;
		return direction * total;
	}

	function scaleFor(index: number): number {
		return expanded ? 1 : Math.max(0.8, 1 - index * SCALE_STEP);
	}

	/** Only as tall as what is actually shown, so it never blocks the page. */
	const stackHeight = $derived.by(() => {
		const count = toaster.toasts.length;
		if (count === 0) return 0;
		if (!expanded) return (heights[0] ?? 0) + (Math.min(count, visibleToasts) - 1) * PEEK;
		let total = 0;
		for (let i = 0; i < count; i++) total += (heights[i] ?? 0) + (i > 0 ? GAP : 0);
		return total;
	});

	// Swipe to dismiss, tracked per toast.
	let dragId = $state<number | null>(null);
	let dragX = $state(0);
	let dragStart = 0;
	let dragStartedAt = 0;

	const SWIPE_THRESHOLD = 80;
	/** A quick flick should dismiss even if it did not travel far. */
	const SWIPE_VELOCITY = 0.11;

	function onpointerdown(event: PointerEvent, toast: Toast) {
		if (event.button !== 0) return;
		// Ignore extra touches once a drag is under way, or the toast jumps to
		// whichever finger moved last.
		if (dragId !== null) return;
		dragId = toast.id;
		dragX = 0;
		dragStart = event.clientX;
		dragStartedAt = Date.now();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onpointermove(event: PointerEvent) {
		if (dragId === null) return;
		const delta = event.clientX - dragStart;
		// Resist dragging against the exit direction rather than stopping dead.
		dragX = delta > 0 ? delta : delta * 0.25;
	}

	function onpointerup(toast: Toast) {
		if (dragId !== toast.id) return;
		const velocity = Math.abs(dragX) / Math.max(1, Date.now() - dragStartedAt);
		const dismiss = dragX > SWIPE_THRESHOLD || (dragX > 8 && velocity > SWIPE_VELOCITY);
		dragId = null;
		dragX = 0;
		if (dismiss) toaster.dismiss(toast.id);
	}

	function expand() {
		expanded = true;
		toaster.pause();
	}

	function collapse() {
		expanded = false;
		toaster.resume();
	}
</script>

<svelte:document {onvisibilitychange} />

<!--
	`polite` so a toast waits its turn instead of cutting off whatever the screen
	reader is currently saying. The region is always present — announcements only
	work if the container exists before the content arrives.

	`pointerover`/`pointerout` rather than `enter`/`leave`: the region itself is
	`pointer-events-none` so it is never a hit target, and enter/leave do not
	bubble from the toasts inside it. Using them would leave pause-on-hover
	silently doing nothing.
-->
<!--
	Two live regions, both in the DOM from mount, and the toasts routed into the
	one matching their tone. A `role="alert"` card nested inside a polite region
	is undefined in practice — screen readers commonly attribute the mutation to
	the outer registered region, so the urgent message queued behind whatever was
	already being read. The cards carry no live role of their own now; the region
	they land in is what decides.
-->
<div aria-live="assertive" aria-atomic="false" class="sr-only">
	{#each toaster.toasts as toast (toast.id)}
		{#if toast.tone === 'error'}
			<p>{toast.title}{toast.description ? `. ${toast.description}` : ''}</p>
		{/if}
	{/each}
</div>

<section
	aria-live="polite"
	aria-label="Notifications"
	data-slot="toaster"
	data-expanded={expanded ? '' : undefined}
	style="height: {stackHeight}px"
	class={cn(
		'pointer-events-none fixed z-50 w-full max-w-sm px-4 transition-[height] duration-(--duration-drawer) ease-out motion-reduce:transition-none',
		// Clear the notch and the home indicator on a phone.
		fromTop
			? 'top-[max(--spacing(4),env(safe-area-inset-top))]'
			: 'bottom-[max(--spacing(4),env(safe-area-inset-bottom))]',
		position.endsWith('center')
			? 'left-1/2 -translate-x-1/2'
			: position.endsWith('left')
				? 'left-0'
				: 'right-0',
		className
	)}
	onpointerover={expand}
	onpointerout={collapse}
	onfocusin={expand}
	onfocusout={collapse}
>
	{#each toaster.toasts as toast, index (toast.id)}
		{@const dragging = dragId === toast.id}
		{@const buried = index >= visibleToasts && !expanded}
		<!--
			`aria-hidden` alongside the opacity: a buried toast is invisible but was
			still announced and still walkable in browse mode, so the screen-reader
			user got five stacked messages where the sighted user saw three. The
			text of an error toast is announced by the assertive region above, which
			is why hiding the card here loses nothing.
		-->
		<div
			aria-hidden={buried || undefined}
			data-slot="toast"
			data-tone={toast.tone}
			data-index={index}
			bind:this={nodes[index]}
			data-expanded={expanded ? '' : undefined}
			style="--toast-index: {index}; --offset: {offsetFor(index)}px; --scale: {scaleFor(
				index
			)}; --drag: {dragging ? dragX : 0}px; z-index: {toaster.toasts.length -
				index}; opacity: {buried ? 0 : dragging ? Math.max(0.4, 1 - dragX / 240) : 1};"
			class={cn(
				'pointer-events-auto absolute inset-x-4 flex touch-pan-y flex-col gap-1.5 rounded-lg border bg-[color-mix(in_srgb,var(--popover),var(--color-black)_calc(1%*max(0,var(--toast-index,0))))] px-3.5 py-3 text-popover-foreground shadow-lg/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-expanded:bg-popover dark:bg-[color-mix(in_srgb,var(--popover),var(--color-white)_calc(6%*max(0,var(--toast-index,0))))] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
				fromTop ? 'top-0 origin-top' : 'bottom-0 origin-bottom',
				!dragging &&
					'transition-[translate,scale,opacity] duration-(--duration-drawer) ease-drawer motion-reduce:transition-none'
			)}
			onpointerdown={(event) => onpointerdown(event, toast)}
			{onpointermove}
			onpointerup={() => onpointerup(toast)}
			onpointercancel={() => onpointerup(toast)}
		>
			<div class="flex items-start gap-2">
				{#if toast.tone !== 'default'}
					<!--
						The icon carries the tone; the text stays neutral. Colouring the whole
						card would make every toast shout.

						It sits in a box one line tall, at the title's own font size, and is
						centred inside it. Sizing the icon itself to `1lh` would both stretch
						the glyph — height and width no longer agree — and measure against
						the card's line-height rather than the title's.
					-->
					<span class="flex h-lh shrink-0 items-center text-sm">
						<Icon
							icon={TONE_ICON[toast.tone]}
							aria-hidden="true"
							class={cn(
								'size-4 shrink-0',
								TONE_COLOR[toast.tone],
								toast.tone === 'loading' && 'animate-spin motion-reduce:animate-none'
							)}
						/>
					</span>
				{/if}
				<div class="flex min-w-0 flex-1 flex-col gap-0.5">
					<p class="text-sm font-medium">{toast.title}</p>
					{#if toast.description}
						<p class="text-sm text-muted-foreground">{toast.description}</p>
					{/if}
				</div>
				{#if toast.action}
					<Button
						size="xs"
						data-slot="toast-action"
						onclick={() => {
							toast.action?.onclick();
							toaster.dismiss(toast.id);
						}}
					>
						{toast.action.label}
					</Button>
				{/if}

				<!--
					The only keyboard route to a toast. Without it the swipe was the sole
					way to dismiss one early and the timer the sole way it left at all —
					no way to pause it, and a `duration: 0` toast could never be cleared
					without a pointer. Focusing it also triggers the region's existing
					`focusin` pause, so reading a long message no longer races the clock.
				-->
				<Button
					size="icon-xs"
					variant="ghost"
					aria-label="Dismiss notification"
					data-slot="toast-close"
					class="-me-1 -mt-0.5 shrink-0 text-muted-foreground"
					onclick={() => toaster.dismiss(toast.id)}
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</Button>
			</div>
		</div>
	{/each}
</section>

<style>
	/*
	 * `translate` and `scale` as separate CSS properties rather than one
	 * `transform`: the stack offset and the swipe then animate independently. As
	 * a transform shorthand each would overwrite the other.
	 */
	[data-slot='toast'] {
		translate: var(--drag) var(--offset);
		scale: var(--scale);
		animation: toast-in var(--duration-drawer) var(--ease-drawer);
	}

	/* Enters from the edge it lives on, which is the direction it will leave in. */
	@keyframes toast-in {
		from {
			opacity: 0;
			translate: 0 calc(var(--offset) + 100%);
			scale: var(--scale);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		[data-slot='toast'] {
			animation: toast-fade 150ms ease;
		}

		@keyframes toast-fade {
			from {
				opacity: 0;
			}
		}
	}
</style>
