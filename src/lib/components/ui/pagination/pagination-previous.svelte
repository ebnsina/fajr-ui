<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import Button, { type ButtonProps } from '../button.svelte';
	import { usePagination } from './context.svelte';

	let {
		class: className,
		children,
		...rest
	}: Omit<ButtonProps, 'children'> & { children?: Snippet } = $props();

	const pagination = usePagination();
</script>

<Button
	variant="ghost"
	size="sm"
	aria-label="Previous page"
	disabled={pagination.isFirst}
	class={cn(className)}
	href={pagination.href && !pagination.isFirst ? pagination.href(pagination.page - 1) : undefined}
	onclick={pagination.href ? undefined : () => pagination.go(pagination.page - 1)}
	{...rest}
>
	<!-- Mirrored under `dir=rtl`: this chevron means "back", not "left". -->
	<svg
		aria-hidden="true"
		class="rtl:-scale-x-100"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
	{#if children}{@render children()}{:else}Previous{/if}
</Button>
