<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type MeterTrackProps = HTMLAttributes<HTMLDivElement> & { children?: Snippet };
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className, children, ...rest }: MeterTrackProps = $props();
</script>

<div
	data-slot="meter-track"
	class={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
	{...rest}
>
	{@render children?.()}
</div>
