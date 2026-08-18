<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type InputGroupProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: InputGroupProps = $props();
</script>

<!--
	The wrapper carries the border and focus ring, and the field inside is
	unstyled — so an icon or button sitting alongside is inside the ring rather
	than beside it.
-->
<div
	data-slot="input-group"
	class={cn(
		'relative inline-flex w-full min-w-0 items-center rounded-lg border border-input bg-background text-base ring-ring ring-offset-background transition-shadow not-dark:bg-clip-padding has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-data-[align=block-end]:flex-col has-data-[align=block-start]:flex-col sm:text-sm dark:bg-input/32 *:[[data-slot=input-control]]:contents **:[input]:min-w-0 **:[input]:flex-1 has-data-[align=block-end]:**:[input]:pt-1.5 has-data-[align=block-start]:**:[input]:pb-1.5 has-data-[align=inline-end]:**:[input]:pe-2 has-data-[align=inline-start]:**:[input]:ps-2',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
