<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let { class: className, ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<!--
	Decorative. The numbers either side already say a run was skipped, and
	announcing "horizontal ellipsis" between two page links tells a screen-reader
	user nothing they can act on.
-->
<span
	aria-hidden="true"
	data-slot="pagination-ellipsis"
	class={cn('flex size-8 items-center justify-center text-muted-foreground', className)}
	{...rest}
>
	…
</span>
