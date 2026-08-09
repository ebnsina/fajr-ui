<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
</script>

<!--
	The current page is not a link — there is nowhere to go. `aria-current` says
	which crumb you are on without inviting a pointless navigation.
-->
<span
	role="link"
	aria-disabled="true"
	aria-current="page"
	data-slot="breadcrumb-page"
	class={cn('text-foreground', className)}
	{...rest}
>
	{@render children?.()}
</span>
