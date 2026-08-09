<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type ToolbarProps = HTMLAttributes<HTMLDivElement> & {
		orientation?: 'horizontal' | 'vertical';
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { horizontalSign } from '$lib/internal/rtl';

	let {
		class: className,
		orientation = 'horizontal',
		label = 'Toolbar',
		children,
		...rest
	}: ToolbarProps = $props();

	let root = $state<HTMLElement | null>(null);

	const FOCUSABLE =
		'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

	function items(): HTMLElement[] {
		return root ? [...root.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
	}

	/**
	 * A toolbar is one tab stop: Tab moves past it, arrows move within. Without
	 * this a ten-button toolbar costs ten presses to skip.
	 */
	function rove() {
		const list = items();
		if (list.length === 0) return;
		// Keep whichever item already holds the tab stop, so re-running this after
		// an unrelated change does not throw focus order back to the first button.
		const active = list.find((item) => item.tabIndex === 0);
		for (const item of list) item.tabIndex = -1;
		(active ?? list[0]).tabIndex = 0;
	}

	/*
	 * The item list is read straight from the DOM, so nothing about it is
	 * reactive — the effect tracked `root` and then never ran again. A button
	 * added later, or one whose `disabled` cleared, arrived with its own default
	 * `tabindex` and the toolbar quietly had two tab stops until the first arrow
	 * press repaired it; an item removed while it held the tab stop left zero,
	 * and Tab skipped the toolbar entirely.
	 *
	 * Watching the subtree covers both. `disabled` and `href` are in the filter
	 * because they decide what counts as an item; `tabindex` deliberately is not,
	 * since setting it is what this observer's own callback does and observing it
	 * would feed straight back into itself.
	 */
	$effect(() => {
		if (!root) return;
		rove();
		const observer = new MutationObserver(rove);
		observer.observe(root, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['disabled', 'href']
		});
		return () => observer.disconnect();
	});

	function onkeydown(event: KeyboardEvent) {
		/*
		 * A text field inside a toolbar keeps its own arrow keys. Roving focus was
		 * swallowing them, so the caret could not be moved and text could not be
		 * selected — every Left threw focus onto a neighbouring button instead.
		 */
		const target = event.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.isContentEditable ||
				target.closest('[role="combobox"],[role="listbox"],[role="textbox"]'))
		) {
			return;
		}

		const list = items();
		if (list.length === 0) return;

		const horizontal = orientation === 'horizontal';
		const forward = horizontal ? 'ArrowRight' : 'ArrowDown';
		const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
		// Right means "previous" when the row is read from the right.
		const step = horizontal ? horizontalSign(event.currentTarget as Element) : 1;

		let next: HTMLElement | undefined;
		const index = list.indexOf(document.activeElement as HTMLElement);
		const at = (offset: number) => list[(index + offset + list.length * 2) % list.length];

		if (event.key === forward) next = at(step);
		else if (event.key === back) next = at(-step);
		else if (event.key === 'Home') next = list[0];
		else if (event.key === 'End') next = list[list.length - 1];
		else return;

		event.preventDefault();
		for (const item of list) item.tabIndex = -1;
		next.tabIndex = 0;
		next.focus();
	}
</script>

<div
	bind:this={root}
	role="toolbar"
	aria-label={label}
	aria-orientation={orientation}
	data-slot="toolbar"
	{onkeydown}
	class={cn(
		'relative flex items-center gap-2 rounded-xl border bg-card p-1 text-card-foreground not-dark:bg-clip-padding',
		orientation === 'vertical' && 'flex-col',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
