<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
</script>

<div
	data-slot="card-frame"
	class={cn(
		'relative flex flex-col rounded-2xl border bg-card text-card-foreground [--clip-bottom:-1rem] [--clip-top:-1rem] not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-muted/72 has-data-[slot=table-container]:overflow-hidden *:data-[slot=card]:-m-px *:data-[slot=card]:bg-clip-padding *:data-[slot=card]:shadow-none *:data-[slot=card]:[clip-path:inset(var(--clip-top)_1px_var(--clip-bottom)_1px_round_calc(var(--radius-2xl)-1px))] *:not-first:data-[slot=card]:rounded-t-xl *:not-last:data-[slot=card]:rounded-b-xl *:data-[slot=card]:before:hidden *:not-first:data-[slot=card]:before:rounded-t-[calc(var(--radius-xl)-1px)] *:not-last:data-[slot=card]:before:rounded-b-[calc(var(--radius-xl)-1px)] *:data-[slot=card]:first:[--clip-top:1px] *:data-[slot=card]:last:[--clip-bottom:1px] *:data-[slot=table-container]:-m-px *:data-[slot=table-container]:w-[calc(100%+2px)]',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
