<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
</script>

<!-- Shown only when nothing in the list survived filtering. -->
<p
	data-slot="command-empty"
	class={cn(
		'hidden px-2 py-8 text-center text-sm text-muted-foreground group-not-has-[[role=option]]/list:block',
		className
	)}
	{...rest}
>
	{#if children}{@render children()}{:else}No results found.{/if}
</p>
