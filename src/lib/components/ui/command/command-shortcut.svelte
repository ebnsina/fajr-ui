<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import Kbd from '../kbd/kbd.svelte';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
</script>

<span data-slot="command-shortcut" class={cn('ms-auto ps-4', className)} {...rest}>
	<Kbd>{@render children?.()}</Kbd>
</span>
