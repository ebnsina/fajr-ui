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

<main
	data-slot="sidebar-inset"
	class={cn(
		'relative flex w-full flex-1 flex-col bg-background',
		'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm/5 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2',
		className
	)}
	{...rest}
>
	{@render children?.()}
</main>
