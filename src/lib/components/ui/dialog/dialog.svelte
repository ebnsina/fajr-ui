<script module lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type DialogProps = Omit<HTMLDialogAttributes, 'open'> & {
		open?: boolean;
		/** Fallback accessible name when no `<DialogTitle>` is rendered. */
		title?: string;
		showCloseButton?: boolean;
		/** Clicking the backdrop closes the dialog. */
		dismissible?: boolean;
		/** `alertdialog` for a choice the user must make explicitly. */
		role?: 'dialog' | 'alertdialog';
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../button.svelte';
	import { DialogState, setDialogContext } from './context.svelte';

	const baseId = $props.id();

	let {
		class: className,
		open = $bindable(false),
		title,
		showCloseButton = true,
		dismissible = true,
		role = 'dialog',
		children,
		...rest
	}: DialogProps = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	const dialogState = setDialogContext(
		new DialogState({
			close: () => (open = false),
			titleId: `${baseId}-title`,
			descriptionId: `${baseId}-description`
		})
	);

	// `showModal` supplies the focus trap, Escape handling, inert background and
	// top-layer stacking. None of that is worth reimplementing.
	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={dialogState.labelledBy}
	aria-describedby={dialogState.describedBy}
	aria-label={dialogState.labelledBy ? undefined : title}
	{role}
	data-slot="dialog"
	onclose={() => (open = false)}
	onclick={(event) => {
		// A click landing on the dialog itself is a click on the backdrop.
		if (dismissible && event.target === dialog) open = false;
	}}
	class={cn(
		'relative m-auto max-h-[calc(100svh-2rem)] w-[calc(100vw-2rem)] max-w-lg flex-col overflow-hidden rounded-2xl border bg-popover p-0 text-popover-foreground shadow-lg/5 not-dark:bg-clip-padding open:flex',
		className
	)}
	{...rest}
>
	{#if open}
		{@render children?.()}
		{#if showCloseButton}
			<Button
				size="icon"
				variant="ghost"
				aria-label="Close"
				class="absolute end-2 top-2"
				onclick={() => (open = false)}
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
	 * `allow-discrete` on `display` and `overlay` is what lets the *exit* animate
	 * — without it the dialog leaves the top layer the instant `close()` runs and
	 * the transition never plays.
	 *
	 * A modal keeps `transform-origin: center`: unlike a popover it is not
	 * anchored to a trigger, so it belongs in the middle of the viewport.
	 */
	dialog {
		opacity: 0;
		scale: 0.96;
		transition:
			opacity var(--duration-popover) var(--ease-out),
			scale var(--duration-popover) var(--ease-out),
			display var(--duration-popover) allow-discrete,
			overlay var(--duration-popover) allow-discrete;
	}

	dialog[open] {
		opacity: 1;
		scale: 1;
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			scale: 0.96;
		}
	}

	dialog::backdrop {
		background-color: rgb(0 0 0 / 0.32);
		opacity: 0;
		backdrop-filter: blur(2px);
		transition:
			opacity var(--duration-popover) var(--ease-out),
			display var(--duration-popover) allow-discrete,
			overlay var(--duration-popover) allow-discrete;
	}

	dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	/* Reduced motion keeps the fade, which aids comprehension, and drops the scale. */
	@media (prefers-reduced-motion: reduce) {
		dialog,
		dialog[open] {
			scale: 1;
		}

		@starting-style {
			dialog[open] {
				scale: 1;
			}
		}
	}
</style>
