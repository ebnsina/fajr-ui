<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type PaginationRootProps = HTMLAttributes<HTMLElement> & {
		page?: number;
		count: number;
		/** How many numbered links to show either side of the current page. */
		siblings?: number;
		/** Builds the href for a page; omit for button-driven pagination. */
		href?: (page: number) => string;
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { PaginationState, setPaginationContext } from './context.svelte';

	let {
		class: className,
		page = $bindable(1),
		count,
		siblings = 1,
		href,
		label = 'Pagination',
		children,
		...rest
	}: PaginationRootProps = $props();

	setPaginationContext(
		new PaginationState({
			page: () => page,
			setPage: (next) => (page = next),
			count: () => count,
			siblings: () => siblings,
			href: () => href
		})
	);
</script>

<!-- A landmark, so a page with two of these can name them apart. -->
<nav
	aria-label={label}
	data-slot="pagination"
	class={cn('flex justify-center', className)}
	{...rest}
>
	{@render children?.()}
</nav>
