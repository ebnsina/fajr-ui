<script module lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SheetPopupProps = Omit<HTMLDialogAttributes, 'open'> & {
		/** Fallback accessible name when no `<SheetTitle>` is rendered. */
		title?: string;
		showCloseButton?: boolean;
		/** Clicking the backdrop closes the sheet. */
		dismissible?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../button.svelte';
	import { useSheet } from './context.svelte';

	let {
		class: className,
		title,
		showCloseButton = true,
		dismissible = true,
		children,
		...rest
	}: SheetPopupProps = $props();

	const sheet = useSheet();
	let dialog = $state<HTMLDialogElement | null>(null);

	// `showModal` supplies the focus trap, Escape handling, inert background and
	// top-layer stacking. None of that is worth reimplementing.
	$effect(() => {
		if (!dialog) return;
		if (sheet.open && !dialog.open) dialog.showModal();
		else if (!sheet.open && dialog.open) dialog.close();
	});

	// The offscreen resting position, as a share of the panel's own size, so it
	// stays correct at any width.
	const hidden = $derived(
		{
			left: 'translateX(-100%)',
			right: 'translateX(100%)',
			top: 'translateY(-100%)',
			bottom: 'translateY(100%)'
		}[sheet.side]
	);

	const inset = $derived(sheet.variant === 'inset');
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={sheet.labelledBy}
	aria-describedby={sheet.describedBy}
	aria-label={sheet.labelledBy ? undefined : title}
	data-slot="sheet-popup"
	data-side={sheet.side}
	data-variant={sheet.variant}
	style="--sheet-hidden: {hidden}"
	onclose={() => sheet.close()}
	onclick={(event) => {
		// A click landing on the dialog itself is a click on the backdrop.
		if (dismissible && event.target === dialog) sheet.close();
	}}
	class={cn(
		'fixed z-50 m-0 max-w-none bg-popover p-0 text-popover-foreground shadow-lg/5 not-dark:bg-clip-padding open:flex open:flex-col',
		/*
		 * The `*-auto` classes are load-bearing. The UA stylesheet gives
		 * `dialog:modal` an `inset: 0`, pinning all four edges — so a sheet that
		 * sets only its near edge is either stretched across the viewport
		 * (top/bottom) or snapped to the opposite side (left/right), since an
		 * over-constrained box resolves in favour of the start edge. Releasing the
		 * far edge is what lets each side sit where it was asked to.
		 */
		sheet.side === 'left' &&
			'inset-y-0 right-auto left-0 h-svh max-h-none w-[min(24rem,calc(100vw-3rem))] border-r',
		sheet.side === 'right' &&
			'inset-y-0 right-0 left-auto h-svh max-h-none w-[min(24rem,calc(100vw-3rem))] border-l',
		sheet.side === 'top' &&
			'inset-x-0 top-0 bottom-auto h-auto max-h-[calc(100svh-3rem)] w-svw border-b pt-[env(safe-area-inset-top)]',
		sheet.side === 'bottom' &&
			'inset-x-0 top-auto bottom-0 h-auto max-h-[calc(100svh-3rem)] w-svw border-t pb-[env(safe-area-inset-bottom)]',
		// Inset floats the panel clear of the edges, so it needs a full border and
		// a corner radius the flush variant would only ever show half of.
		inset && 'sm:rounded-2xl sm:border',
		inset && sheet.side === 'left' && 'sm:inset-y-4 sm:left-4 sm:h-[calc(100svh-2rem)]',
		inset && sheet.side === 'right' && 'sm:inset-y-4 sm:right-4 sm:h-[calc(100svh-2rem)]',
		inset && sheet.side === 'top' && 'sm:inset-x-4 sm:top-4 sm:w-auto',
		inset && sheet.side === 'bottom' && 'sm:inset-x-4 sm:bottom-4 sm:w-auto',
		className
	)}
	{...rest}
>
	{#if sheet.open}
		{@render children?.()}
		{#if showCloseButton}
			<Button
				size="icon"
				variant="ghost"
				aria-label="Close"
				class="absolute end-2 top-2"
				onclick={() => sheet.close()}
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
		{/if}
	{/if}
</dialog>

<style>
	/*
	 * `allow-discrete` lets the browser animate `display` and `overlay`, which is
	 * what makes the *exit* animate too — without it the dialog would snap shut
	 * the moment `close()` runs. `@starting-style` supplies the entry values.
	 *
	 * Transitions rather than keyframes so a sheet reopened mid-close retargets
	 * from where it actually is instead of restarting from offscreen.
	 */
	dialog {
		opacity: 0;
		transform: var(--sheet-hidden);
		transition:
			opacity var(--duration-drawer) var(--ease-drawer),
			transform var(--duration-drawer) var(--ease-drawer),
			display var(--duration-drawer) allow-discrete,
			overlay var(--duration-drawer) allow-discrete;
	}

	dialog[open] {
		opacity: 1;
		transform: none;
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: var(--sheet-hidden);
		}
	}

	/*
	 * The backdrop is `::backdrop` rather than an element: a modal dialog is
	 * already in the top layer, so the platform paints and stacks it. These
	 * custom properties are the seam for restyling it.
	 */
	dialog::backdrop {
		background-color: var(--sheet-backdrop, rgb(0 0 0 / 0.32));
		backdrop-filter: blur(var(--sheet-backdrop-blur, 2px));
		opacity: 0;
		transition:
			opacity var(--duration-drawer) var(--ease-drawer),
			display var(--duration-drawer) allow-discrete,
			overlay var(--duration-drawer) allow-discrete;
	}

	dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	/* Reduced motion keeps the fade, which aids comprehension, and drops travel. */
	@media (prefers-reduced-motion: reduce) {
		dialog,
		dialog[open] {
			transform: none;
		}

		@starting-style {
			dialog[open] {
				transform: none;
			}
		}
	}
</style>
