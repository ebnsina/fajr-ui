<script module lang="ts">
	import type { SeparatorProps } from '../separator.svelte';

	export type ToolbarSeparatorProps = SeparatorProps;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Separator from '../separator.svelte';

	let { class: className, orientation = 'vertical', ...rest }: ToolbarSeparatorProps = $props();
</script>

<!--
	`self-center` with a fixed height: a vertical rule that cannot stretch pins to
	the cross-start edge of the row otherwise, which reads as misalignment.
-->
<Separator
	decorative
	{orientation}
	data-slot="toolbar-separator"
	class={cn(orientation === 'vertical' && 'mx-1 h-5 self-center', className)}
	{...rest}
/>
