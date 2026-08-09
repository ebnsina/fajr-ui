<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type DrawerProps = {
		open?: boolean;
		side?: 'bottom' | 'top';
		title?: string;
		/** Fraction of the drawer's height a drag must pass to dismiss it. */
		threshold?: number;
		class?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Sheet, SheetPopup } from '../sheet';

	let {
		open = $bindable(false),
		side = 'bottom',
		title = 'Drawer',
		threshold = 0.4,
		class: className,
		children
	}: DrawerProps = $props();

	let panel = $state<HTMLElement | null>(null);
	let dragging = $state(false);
	let offset = $state(0);
	let start = 0;
	let startedAt = 0;

	const SWIPE_VELOCITY = 0.4;

	function onpointerdown(event: PointerEvent) {
		if (event.button !== 0 || dragging) return;
		dragging = true;
		start = event.clientY;
		startedAt = Date.now();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onpointermove(event: PointerEvent) {
		if (!dragging) return;
		const delta = event.clientY - start;
		const closing = side === 'bottom' ? delta > 0 : delta < 0;
		// Dragging the wrong way meets increasing resistance rather than a wall.
		offset = closing ? delta : delta * 0.2;
	}

	function onpointerup() {
		if (!dragging) return;
		dragging = false;

		const height = panel?.getBoundingClientRect().height ?? 1;
		const travelled = side === 'bottom' ? offset : -offset;
		const velocity = Math.abs(offset) / Math.max(1, Date.now() - startedAt);

		// A quick flick dismisses even if it did not travel far — requiring the
		// full distance makes a drawer feel stuck.
		if (travelled > height * threshold || (travelled > 24 && velocity > SWIPE_VELOCITY)) {
			open = false;
		}
		offset = 0;
	}
</script>

<Sheet bind:open {side}>
	<SheetPopup
		{title}
		showCloseButton={false}
		class={cn('w-full rounded-t-2xl border-x-0 border-b-0', className)}
	>
		<div
			bind:this={panel}
			class={cn(
				'flex w-full flex-col',
				!dragging &&
					'transition-transform duration-(--duration-drawer) ease-drawer motion-reduce:transition-none'
			)}
			style={offset === 0 ? undefined : `transform: translateY(${offset}px)`}
		>
			<!--
				The grab handle is the drag surface, so dragging never fights with
				scrolling or text selection in the content below it.
			-->
			<div
				data-slot="drawer-handle"
				role="presentation"
				class="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
				{onpointerdown}
				{onpointermove}
				{onpointerup}
				onpointercancel={onpointerup}
			>
				<span class="h-1.5 w-12 rounded-full bg-muted-foreground/32"></span>
			</div>
			{@render children?.()}
		</div>
	</SheetPopup>
</Sheet>
