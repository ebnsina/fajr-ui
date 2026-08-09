<script lang="ts">
	import type { HTMLLiAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: HTMLLiAttributes & { children?: Snippet } = $props();
</script>

<li data-slot="pagination-item" class={cn(className)} {...rest}>{@render children?.()}</li>
