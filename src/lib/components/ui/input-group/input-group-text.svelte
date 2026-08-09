<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type InputGroupTextProps = HTMLAttributes<HTMLSpanElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: InputGroupTextProps = $props();
</script>

<!-- Static text inside an addon — a unit, a prefix, a currency symbol. -->
<span
	data-slot="input-group-text"
	class={cn(
		"flex items-center gap-2 truncate text-muted-foreground [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...rest}
>
	{@render children?.()}
</span>
