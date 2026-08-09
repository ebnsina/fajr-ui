<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ToggleProps } from '../toggle.svelte';

	export type ToggleGroupItemProps = Omit<ToggleProps, 'value'> & {
		/** Identifies this item within the group's value. */
		value: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import Toggle from '../toggle.svelte';

	let { children, ...rest }: ToggleGroupItemProps = $props();
</script>

<!--
	A Toggle that takes its pressed state, variant and size from the surrounding
	group. The only difference from Toggle itself is that `value` is required —
	without one the group has nothing to record.
-->
<Toggle data-slot="toggle-group-item" {...rest}>
	{@render children?.()}
</Toggle>
