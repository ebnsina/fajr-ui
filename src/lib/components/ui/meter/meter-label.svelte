<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MeterLabelProps = HTMLAttributes<HTMLSpanElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { useMeter } from './context.svelte';

	let { class: className, children, ...rest }: MeterLabelProps = $props();

	const meter = useMeter();
</script>

<span
	id={meter.labelId}
	data-slot="meter-label"
	class={cn('text-sm text-muted-foreground', className)}
	{...rest}
>
	{@render children?.()}
</span>
