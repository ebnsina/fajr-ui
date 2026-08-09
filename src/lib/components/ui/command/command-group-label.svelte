<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CommandGroupLabelProps = HTMLAttributes<HTMLParagraphElement> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: CommandGroupLabelProps = $props();
</script>

<!-- The heading above a run of results. Pair with `<CommandGroup>`'s `aria-label`. -->
<p
	data-slot="command-group-label"
	class={cn('px-2 pb-1 text-xs font-medium text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</p>
