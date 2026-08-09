<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type CommandGroupProps = HTMLAttributes<HTMLDivElement> & {
		heading?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, heading, children, ...rest }: CommandGroupProps = $props();
</script>

<!-- A group with nothing left after filtering hides itself, heading and all. -->
<div
	role="group"
	aria-label={heading}
	data-slot="command-group"
	class={cn('not-first:mt-2 not-has-[[role=option]]:hidden', className)}
	{...rest}
>
	{#if heading}
		<p class="px-2 pb-1 text-xs font-medium text-muted-foreground">{heading}</p>
	{/if}
	{@render children?.()}
</div>
