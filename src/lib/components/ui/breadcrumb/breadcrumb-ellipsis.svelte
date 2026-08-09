<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let { class: className, ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<!-- Collapsed crumbs. Hidden from AT: the surrounding links carry the path. -->
<span
	role="presentation"
	aria-hidden="true"
	data-slot="breadcrumb-ellipsis"
	class={cn('flex size-5 items-center justify-center', className)}
	{...rest}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		class="size-4"
	>
		<circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
	</svg>
	<span class="sr-only">More</span>
</span>
