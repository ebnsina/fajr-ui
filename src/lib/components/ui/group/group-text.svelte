<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type GroupTextProps = HTMLAttributes<HTMLDivElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: GroupTextProps = $props();
</script>

<!--
	A static segment — a unit, a prefix, a count — styled like the controls beside
	it so the joined edge reads as one object rather than a button next to a label.
-->
<div
	data-slot="group-text"
	class={cn(
		"flex h-9 items-center gap-2 border border-input bg-muted px-3 text-sm text-muted-foreground not-dark:bg-clip-padding sm:h-8 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
