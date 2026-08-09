<script lang="ts">
	import { cn } from '$lib/utils';
	import Separator, { type SeparatorProps } from '../separator.svelte';

	let { class: className, ...rest }: SeparatorProps = $props();
</script>

<Separator
	data-sidebar="separator"
	data-slot="sidebar-separator"
	class={cn('mx-2 w-auto bg-sidebar-border', className)}
	{...rest}
/>
