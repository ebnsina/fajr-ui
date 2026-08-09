<script module lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type TableVariant = 'default' | 'card';

	export type TableProps = HTMLTableAttributes & {
		/** `card` lifts the body onto its own rounded, bordered surface. */
		variant?: TableVariant;
		/**
		 * Names the scrollable region. Give it whenever a page has more than one
		 * table, or the landmark list reads "Table, Table, Table".
		 */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, variant = 'default', label, children, ...rest }: TableProps = $props();
</script>

<!--
	The container scrolls and is focusable, so a wide table can be scrolled by
	keyboard instead of only by dragging.
-->
<!--
	A scrollable region must be reachable by keyboard, or a wide table can only be
	read by dragging. The linter objects because `region` is non-interactive, but
	that is exactly the case the rule is meant to exempt.
-->
<!--
	The name is a prop, because a page with several tables otherwise lists
	"Table, Table, Table" in the landmark menu with nothing to tell them apart.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	data-slot="table-container"
	data-variant={variant}
	tabindex="0"
	role="region"
	aria-label={label ?? 'Table'}
	class="w-full overflow-x-auto rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring"
>
	<!--
		`border-separate` in the card variant: the body's rounded corners and its
		border live on the cells, and a collapsed border model cannot round them.
	-->
	<table
		data-slot="table"
		class={cn(
			'w-full caption-bottom text-sm in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</table>
</div>
