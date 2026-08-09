<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type GroupProps = HTMLAttributes<HTMLDivElement> & {
		orientation?: 'horizontal' | 'vertical';
		/** Accessible name for the set of controls. */
		label?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		orientation = 'horizontal',
		label,
		children,
		...rest
	}: GroupProps = $props();
</script>

<!--
	Joins adjacent controls into one unit: only the outer corners stay rounded and
	the shared edge collapses to a single border rather than two stacked ones.
-->
<div
	role="group"
	aria-label={label}
	data-slot="group"
	data-orientation={orientation}
	class={cn(
		'isolate flex',
		orientation === 'horizontal'
			? 'flex-row [&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none'
			: 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
		'[&>*:focus-visible]:z-10 [&>*:hover]:z-10',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
