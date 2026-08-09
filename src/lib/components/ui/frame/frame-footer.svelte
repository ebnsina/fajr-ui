<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
</script>

<footer data-slot="frame-panel-footer" class={cn('px-5 py-4', className)} {...rest}>
	{@render children?.()}
</footer>
