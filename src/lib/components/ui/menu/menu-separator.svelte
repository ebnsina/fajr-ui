<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<!-- Announced as a separator inside the menu, so groups are audible too. -->
<div
	role="separator"
	aria-orientation="horizontal"
	data-slot="menu-separator"
	class={cn('mx-1 my-1 h-px bg-border', className)}
	{...rest}
></div>
