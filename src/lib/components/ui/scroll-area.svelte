<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
		/** Fades content out at whichever edges have more to scroll to. */
		scrollFade?: boolean;
		/** Stops scroll chaining to the page when this area hits its end. */
		overscrollContain?: boolean;
		/** Makes the content fill the viewport rather than hug its height. */
		fill?: boolean;
		orientation?: 'vertical' | 'horizontal' | 'both';
		/** Names the scrolling region, which is focusable. */
		label?: string;
		viewportClass?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		viewportClass,
		scrollFade = false,
		overscrollContain = false,
		fill = false,
		orientation = 'vertical',
		label,
		children,
		...rest
	}: ScrollAreaProps = $props();

	let viewport = $state<HTMLDivElement | null>(null);

	// How much is scrolled away on each edge, so the fade only appears on the
	// sides that actually have more content — a fade at the top of an unscrolled
	// list reads as a rendering bug.
	let startOffset = $state(0);
	let endOffset = $state(0);

	function measure() {
		if (!viewport) return;
		if (orientation === 'horizontal') {
			startOffset = viewport.scrollLeft;
			endOffset = viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft;
		} else {
			startOffset = viewport.scrollTop;
			endOffset = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
		}
	}

	$effect(() => {
		if (!viewport || !scrollFade) return;
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		for (const child of viewport.children) observer.observe(child);
		return () => observer.disconnect();
	});
</script>

<!--
	A flex column rather than percentage heights: an ancestor sized by
	`max-height` is not a definite height, so `height: 100%` inside it collapses
	to the content's own height and the viewport never scrolls.
-->
<div data-slot="scroll-area" class={cn('flex min-h-0 w-full flex-col', className)} {...rest}>
	<!--
		A scroll region must be reachable by keyboard, or its overflow is
		unreachable without a pointer (WCAG 2.1.1) — Table and VirtualList already
		do this. The rule cannot tell a scroll container from a static one.
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={viewport}
		onscroll={scrollFade ? measure : undefined}
		role="region"
		tabindex="0"
		aria-label={label}
		data-slot="scroll-area-viewport"
		style={scrollFade
			? `--scroll-start: ${startOffset}px; --scroll-end: ${endOffset}px`
			: undefined}
		class={cn(
			'min-h-0 flex-1 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
			orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
			orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
			orientation === 'both' && 'overflow-auto',
			overscrollContain && 'overscroll-contain',
			scrollFade && orientation !== 'horizontal' && 'fade-y',
			scrollFade && orientation === 'horizontal' && 'fade-x',
			viewportClass
		)}
	>
		<div data-slot="scroll-area-content" class={cn('min-w-0', fill && 'size-full')}>
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	/*
	 * Native scrollbars, restyled. A native scroller keeps keyboard paging,
	 * momentum, and the platform's own overscroll behaviour — all of which a
	 * JS-driven custom scrollbar has to reimplement and usually gets wrong.
	 */
	[data-slot='scroll-area-viewport'] {
		scrollbar-width: thin;
		scrollbar-color: transparent transparent;
		transition: scrollbar-color 200ms ease;
	}

	[data-slot='scroll-area-viewport']:hover,
	[data-slot='scroll-area-viewport']:focus-within {
		scrollbar-color: --alpha(var(--color-foreground) / 20%) transparent;
	}

	[data-slot='scroll-area-viewport']::-webkit-scrollbar {
		width: 0.375rem;
		height: 0.375rem;
	}

	[data-slot='scroll-area-viewport']::-webkit-scrollbar-track {
		background: transparent;
	}

	[data-slot='scroll-area-viewport']::-webkit-scrollbar-thumb {
		border-radius: 9999px;
		background-color: transparent;
		transition: background-color 200ms ease;
	}

	[data-slot='scroll-area-viewport']:hover::-webkit-scrollbar-thumb,
	[data-slot='scroll-area-viewport']:focus-within::-webkit-scrollbar-thumb {
		background-color: --alpha(var(--color-foreground) / 20%);
	}

	/* The fade tracks the scroll offset, so it grows in as you leave an edge. */
	.fade-y {
		--fade: 1.5rem;
		mask-image: linear-gradient(
			to bottom,
			transparent 0,
			#000 min(var(--fade), var(--scroll-start)),
			#000 calc(100% - min(var(--fade), var(--scroll-end))),
			transparent 100%
		);
	}

	.fade-x {
		--fade: 1.5rem;
		mask-image: linear-gradient(
			to right,
			transparent 0,
			#000 min(var(--fade), var(--scroll-start)),
			#000 calc(100% - min(var(--fade), var(--scroll-end))),
			transparent 100%
		);
	}
</style>
