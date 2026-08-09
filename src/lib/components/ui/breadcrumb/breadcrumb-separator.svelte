<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLLIElement> & { children?: Snippet } = $props();
</script>

<!-- Decorative: the list structure already conveys the hierarchy. -->
<li
	aria-hidden="true"
	data-slot="breadcrumb-separator"
	class={cn('opacity-80 [&>svg]:size-4 rtl:[&>svg]:-scale-x-100', className)}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
	{/if}
</li>
