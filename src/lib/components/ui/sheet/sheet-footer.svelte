<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type SheetFooterProps = HTMLAttributes<HTMLDivElement> & {
		/** `bare` drops the rule and fill, for a footer that is just buttons. */
		variant?: 'default' | 'bare';
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, variant = 'default', children, ...rest }: SheetFooterProps = $props();
</script>

<div
	data-slot="sheet-footer"
	class={cn(
		'flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end',
		variant === 'default' && 'border-t bg-muted/72 py-4',
		variant === 'bare' &&
			'pt-4 pb-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pt-3',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
