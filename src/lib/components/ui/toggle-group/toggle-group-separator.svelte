<script module lang="ts">
	import type { SeparatorProps } from '../separator.svelte';

	export type ToggleGroupSeparatorProps = SeparatorProps;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Separator from '../separator.svelte';

	let { class: className, orientation = 'vertical', ...rest }: ToggleGroupSeparatorProps = $props();
</script>

<!-- Divides runs within the group without breaking the joined edge. -->
<Separator
	decorative
	{orientation}
	data-slot="toggle-group-separator"
	class={cn('relative z-10 self-stretch bg-input', className)}
	{...rest}
/>
