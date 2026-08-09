<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
		orientation?: 'horizontal' | 'vertical';
		/** Purely visual separators are hidden from the a11y tree. */
		decorative?: boolean;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		orientation = 'horizontal',
		decorative = false,
		...rest
	}: SeparatorProps = $props();
</script>

<div
	role={decorative ? 'none' : 'separator'}
	aria-orientation={decorative || orientation === 'horizontal' ? undefined : 'vertical'}
	data-orientation={orientation}
	data-slot="separator"
	class={cn(
		"shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
		className
	)}
	{...rest}
></div>
