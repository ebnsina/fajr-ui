<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ButtonProps } from '../button.svelte';

	export type PaginationLinkProps = Omit<ButtonProps, 'children'> & {
		page: number;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from '../button.svelte';
	import { usePagination } from './context.svelte';

	let { class: className, page, children, ...rest }: PaginationLinkProps = $props();

	const pagination = usePagination();
	const current = $derived(pagination.isCurrent(page));
</script>

<!--
	`tabular-nums` and a floor on the width: a two-digit page is wider than a
	one-digit one in proportional figures, so without both the control creeps a
	few pixels as the numbers roll over.

	`aria-current="page"` rather than a pressed state — this is which page you
	are on, not a control that is switched on.
-->
<Button
	variant={current ? 'outline' : 'ghost'}
	size="icon-sm"
	class={cn('min-w-8 px-1 tabular-nums', className)}
	aria-label="Page {page}"
	aria-current={current ? 'page' : undefined}
	href={pagination.href ? pagination.href(page) : undefined}
	onclick={pagination.href ? undefined : () => pagination.go(page)}
	{...rest}
>
	{#if children}{@render children()}{:else}{page}{/if}
</Button>
