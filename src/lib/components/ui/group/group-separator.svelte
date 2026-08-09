<script module lang="ts">
	import type { SeparatorProps } from '../separator.svelte';

	export type GroupSeparatorProps = SeparatorProps;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Separator from '../separator.svelte';

	let { class: className, orientation, ...rest }: GroupSeparatorProps = $props();
</script>

<!--
	Divides a group into runs without breaking the joined edge. It runs across the
	group, so its orientation is the opposite of the group's own.
-->
<Separator
	decorative
	orientation={orientation ?? 'vertical'}
	data-slot="group-separator"
	class={cn('relative z-10 self-stretch bg-input', className)}
	{...rest}
/>
