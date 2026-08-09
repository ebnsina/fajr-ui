<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="skeleton"
	class={cn(
		'animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] motion-reduce:animate-none motion-reduce:bg-muted dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]',
		className
	)}
	{...rest}
></div>
